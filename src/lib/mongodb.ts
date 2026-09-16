import "server-only";
import mongoose from "mongoose";
import "./env";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailureTime: number;
  lastError: Error | null;
}

// Use global cache to prevent multiple connections in dev hot-reloads
declare global {
  var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null, lastFailureTime: 0, lastError: null };
}

const cached = global.mongooseCache;
const CIRCUIT_BREAKER_COOLDOWN_MS = process.env.NODE_ENV === "production" ? 15000 : 5000;
const LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/celife";

async function attemptConnect(uri: string, timeoutMs: number): Promise<typeof mongoose> {
  const opts: mongoose.ConnectOptions = {
    bufferCommands: false,
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: timeoutMs,
    connectTimeoutMS: timeoutMs,
    socketTimeoutMS: 20000,
    maxIdleTimeMS: 30000,
  };

  return mongoose.connect(uri, opts);
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
  }

  // Fast-fail circuit breaker if connection recently timed out/failed
  if (cached.lastFailureTime > 0) {
    const timeSinceLastFailure = Date.now() - cached.lastFailureTime;
    if (timeSinceLastFailure < CIRCUIT_BREAKER_COOLDOWN_MS) {
      const remainingSec = Math.round((CIRCUIT_BREAKER_COOLDOWN_MS - timeSinceLastFailure) / 1000);
      const rootCause = cached.lastError?.message ? ` (Cause: ${cached.lastError.message})` : "";
      throw new Error(
        `MongoDB connection cooldown active (${remainingSec}s remaining)${rootCause}`
      );
    }
  }

  // If already connected and connection is alive (readyState === 1), reuse
  if (cached.conn) {
    if (cached.conn.connection.readyState === 1) {
      return cached.conn;
    }
    // Connection was dropped or disconnected; reset cache
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        const timeoutMs = process.env.NODE_ENV === "production" ? 5000 : 3000;
        return await attemptConnect(MONGODB_URI, timeoutMs);
      } catch (primaryErr) {
        // In local development, if primary URI fails (e.g. Atlas IP not whitelisted),
        // gracefully attempt fallback to local MongoDB instance
        const isRemoteUri = !MONGODB_URI.includes("127.0.0.1") && !MONGODB_URI.includes("localhost");
        if (process.env.NODE_ENV !== "production" && isRemoteUri) {
          console.warn(
            `[MongoDB] Primary connection failed: ${(primaryErr as Error).message}. Attempting local MongoDB fallback (${LOCAL_MONGODB_URI})...`
          );
          try {
            try {
              await mongoose.disconnect();
            } catch {}
            const fallbackConn = await attemptConnect(LOCAL_MONGODB_URI, 2000);
            console.log(`[MongoDB] Connected to local MongoDB fallback successfully.`);
            return fallbackConn;
          } catch (fallbackErr) {
            console.error(
              `[MongoDB] Local fallback also failed: ${(fallbackErr as Error).message}`
            );
          }
        }
        throw primaryErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
    cached.lastFailureTime = 0; // reset circuit breaker on success
    cached.lastError = null;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastFailureTime = Date.now(); // trigger cooldown on failure
    cached.lastError = e as Error;
    throw e;
  }

  return cached.conn;
}


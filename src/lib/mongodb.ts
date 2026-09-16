import "server-only";
import mongoose from "mongoose";
import "./env";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailureTime: number;
}

// Use global cache to prevent multiple connections in dev hot-reloads
declare global {
  var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null, lastFailureTime: 0 };
}

const cached = global.mongooseCache;
const CIRCUIT_BREAKER_COOLDOWN_MS = 30000; // 30s cooldown after connection failure

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
  }

  // Fast-fail circuit breaker if connection recently timed out/failed
  if (cached.lastFailureTime > 0) {
    const timeSinceLastFailure = Date.now() - cached.lastFailureTime;
    if (timeSinceLastFailure < CIRCUIT_BREAKER_COOLDOWN_MS) {
      throw new Error(
        `MongoDB connection cooldown active (${Math.round((CIRCUIT_BREAKER_COOLDOWN_MS - timeSinceLastFailure) / 1000)}s remaining)`
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
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 1500, // 1.5s max timeout to prevent stalling page rendering
      socketTimeoutMS: 20000,
      maxIdleTimeMS: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.lastFailureTime = 0; // reset circuit breaker on success
  } catch (e) {
    cached.promise = null;
    cached.lastFailureTime = Date.now(); // trigger cooldown on failure
    throw e;
  }

  return cached.conn;
}


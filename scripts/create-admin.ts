import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Admin from "../src/models/Admin";
import { hashPassword } from "../src/lib/auth/password";


// Load .env file manually into process.env to ensure compatibility
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      let value = trimmed.substring(index + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
  }
}

async function main() {
  loadEnv();

  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error("Error: Missing required environment variables (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD)");
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);

    console.log(`Checking if admin already exists: ${normalizedEmail}`);
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      console.log(`Admin user with email "${normalizedEmail}" already exists. No action taken.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("Hashing password...");
    const passwordHash = await hashPassword(password);

    console.log("Creating admin user...");
    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log(`Successfully created admin user: ${admin.name} (${admin.email})`);
    
    await mongoose.disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user:", error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

main();

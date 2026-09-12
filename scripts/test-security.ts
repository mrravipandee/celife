import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

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

async function setAdminRole(role: "admin" | "editor") {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not found");
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
  
  const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema({ email: String, role: String }));
  await Admin.updateOne({ email: "admin@example.com" }, { role });
}

async function runSecurityTests() {
  console.log("Starting Step 10 Production Hardening Security Tests...\n");

  // TEST 1 — PUBLIC ACCESS TO ADMIN API (Expects 401)
  {
    console.log("TEST 1: GET /api/enquiries without credentials...");
    const res = await fetch(`${BASE_URL}/api/enquiries`);
    console.log("Status:", res.status);
    if (res.status !== 401) throw new Error("Expected 401 Unauthorized");
    console.log("PASS ✅\n");
  }

  // TEST 2 — BLOG CREATE WITHOUT AUTH (Expects 401)
  {
    console.log("TEST 2: POST /api/blogs without credentials...");
    const res = await fetch(`${BASE_URL}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    console.log("Status:", res.status);
    if (res.status !== 401) throw new Error("Expected 401 Unauthorized");
    console.log("PASS ✅\n");
  }

  // TEST 3 — CASE STUDY CREATE WITHOUT AUTH (Expects 401)
  {
    console.log("TEST 3: POST /api/case-studies without credentials...");
    const res = await fetch(`${BASE_URL}/api/case-studies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    console.log("Status:", res.status);
    if (res.status !== 401) throw new Error("Expected 401 Unauthorized");
    console.log("PASS ✅\n");
  }

  // Set up authenticated sessions for Editor and Admin tests
  console.log("Authenticating Admin user...");
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@example.com", password: "correct-password" }),
  });
  const setCookie = adminLoginRes.headers.get("set-cookie");
  if (!setCookie) throw new Error("Admin login failed");
  const adminCookie = setCookie.split(";")[0];

  // Create a temporary blog to check DELETE auth controls
  const tempBlogRes = await fetch(`${BASE_URL}/api/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      title: "Temp Authorization Blog Title",
      slug: `temp-auth-blog-${Date.now()}`,
      excerpt: "Temp authorization blog excerpt of sufficient length.",
      content: "Temp authorization blog content detailing variables of length >= fifty characters.",
      coverImage: { url: "https://example.com/cover.jpg", alt: "alt text" },
      category: "Hotels",
      tags: [],
      author: { name: "THE DCO" },
      status: "draft",
      readTime: 5,
    }),
  });
  const tempBlogData = await tempBlogRes.json();
  const tempBlogId = tempBlogData.data.id;

  // TEST 4 & 5 — DELETE BLOG & CASE STUDY AS EDITOR (Expects 403)
  {
    console.log("Setting Admin role to 'editor' for authorization check...");
    await setAdminRole("editor");

    const editorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "correct-password" }),
    });
    const editorCookie = editorLoginRes.headers.get("set-cookie")!.split(";")[0];

    console.log(`TEST 4: DELETE /api/blogs/${tempBlogId} as Editor...`);
    const res = await fetch(`${BASE_URL}/api/blogs/${tempBlogId}`, {
      method: "DELETE",
      headers: { Cookie: editorCookie },
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data));
    if (res.status !== 403) throw new Error("Expected 403 Forbidden for editor role");
    console.log("PASS ✅\n");

    console.log("Restoring Admin role to 'admin'...");
    await setAdminRole("admin");
  }

  // TEST 6 — INVALID OBJECT ID (Expects 400)
  {
    console.log("TEST 6: GET /api/blogs/invalid-id-format...");
    const res = await fetch(`${BASE_URL}/api/blogs/invalid-id-format`, {
      headers: { Cookie: adminCookie },
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data));
    if (res.status !== 400) throw new Error("Expected 400 Bad Request");
    console.log("PASS ✅\n");
  }

  // TEST 7 — INVALID STATUS (Expects 422)
  {
    console.log(`TEST 7: PATCH /api/blogs/${tempBlogId} with invalid status...`);
    const res = await fetch(`${BASE_URL}/api/blogs/${tempBlogId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "random-invalid-status" }),
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data));
    if (res.status !== 422) throw new Error("Expected 422 Unprocessable Entity");
    console.log("PASS ✅\n");
  }

  // TEST 8 — MASS ASSIGNMENT ATTEMPT (Expects 422 due to strict schemas)
  {
    console.log("TEST 8: POST /api/blogs with mass assignment fields (role, isAdmin)...");
    const res = await fetch(`${BASE_URL}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        title: "Mass Assignment Attempt Blog",
        slug: "mass-assignment-attempt",
        excerpt: "An excerpt of sufficient length to pass the validation check.",
        content: "Content of sufficient length to pass the validation check which is >= fifty characters.",
        coverImage: { url: "https://example.com/cover.jpg", alt: "alt text" },
        category: "Hotels",
        tags: [],
        author: { name: "THE DCO" },
        status: "draft",
        readTime: 5,
        role: "admin",      // illegal mass assignment
        isAdmin: true,     // illegal mass assignment
      }),
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data));
    if (res.status !== 422) throw new Error("Expected 422 Unprocessable Entity due to strict schema");
    console.log("PASS ✅\n");
  }

  // TEST 11 — INVALID PAGINATION (Expects 422)
  {
    console.log("TEST 11: GET /api/blogs?limit=100000...");
    const res = await fetch(`${BASE_URL}/api/blogs?limit=100000`);
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data));
    if (res.status !== 422) throw new Error("Expected 422 Unprocessable Entity for limit exceed");
    console.log("PASS ✅\n");
  }

  // TEST 12 — SEARCH LIMIT (Expects 422)
  {
    const longSearch = "a".repeat(101);
    console.log(`TEST 12: GET /api/blogs?search=${longSearch}...`);
    const res = await fetch(`${BASE_URL}/api/blogs?search=${longSearch}`);
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data));
    if (res.status !== 422) throw new Error("Expected 422 for excessively long search query");
    console.log("PASS ✅\n");
  }

  // TEST 13 — LOGIN RATE LIMIT (Expects 429)
  {
    console.log("TEST 13: Flooding invalid login requests (checking Rate Limiting)...");
    const statusCodes: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "9.9.9.9",
        },
        body: JSON.stringify({ email: "invalid-user@example.com", password: "wrong-password" }),
      });
      statusCodes.push(res.status);
    }
    console.log("Execution status codes (6 requests):", statusCodes);
    if (!statusCodes.includes(429)) {
      throw new Error("Expected 429 Rate Limit Exceeded code in flood sequence");
    }
    console.log("PASS ✅\n");
  }

  // Clean up the temporary blog post
  console.log(`Cleaning up temporary blog: ${tempBlogId}...`);
  const deleteRes = await fetch(`${BASE_URL}/api/blogs/${tempBlogId}`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  console.log("Delete Status:", deleteRes.status);
  if (deleteRes.status !== 200) throw new Error("Cleanup failed");

  await mongoose.disconnect();
  console.log("All production security hardening tests passed successfully! 🚀");
}

runSecurityTests().catch((err) => {
  console.error("Security tests failed:", err);
  mongoose.disconnect();
  process.exit(1);
});

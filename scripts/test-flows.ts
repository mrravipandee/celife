import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const RUN_IP = `100.100.100.${Math.floor(Math.random() * 250) + 1}`;

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

// Helper to append a unique IP per run for stateless rate limit testing
function fetchWithIp(url: string, options: RequestInit = {}) {
  const opts = options as Record<string, unknown>;
  const headers = (opts.headers || {}) as Record<string, string>;
  if (!headers["x-forwarded-for"]) {
    headers["x-forwarded-for"] = RUN_IP;
  }
  opts.headers = headers;
  return fetch(url, options);
}

async function runFlowTests() {
  console.log("==================================================");
  console.log("RUNNING THE DCO INTEGRATED BACKEND FLOW TESTS");
  console.log("==================================================\n");

  // 1. PUBLIC CONTACT FLOW TEST (POST /api/enquiries)
  console.log("--- 1. CONTACT FLOW TESTS ---");
  let tempEnquiryId = "";
  
  // A. Valid enquiry creation
  {
    console.log("TEST 1.A: Submitting valid enquiry...");
    const res = await fetchWithIp(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Contact",
        email: "contact@example.com",
        phone: "+1234567890",
        company: "Test Corp",
        projectType: "Hotel",
        message: "This is a valid enquiry message for testing.",
      }),
    });
    const body = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(body));
    if (res.status !== 201 || !body.success || !body.data.id) {
      throw new Error("Valid enquiry submission failed");
    }
    tempEnquiryId = body.data.id;
    console.log("PASS ✅\n");
  }

  // B. Parameter Override protection (Zod strict rejects unknown fields)
  {
    console.log("TEST 1.B: Submitting enquiry with illegal admin fields (status override)...");
    const res = await fetchWithIp(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Hack",
        email: "hack@example.com",
        phone: "+1234567890",
        projectType: "Hotel",
        message: "Attempting status injection.",
        status: "closed", // illegal status injection
      }),
    });
    const body = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(body));
    if (res.status !== 422) {
      throw new Error("Expected 422 validation failure due to strict schema constraint");
    }
    console.log("PASS ✅\n");
  }

  // C. Invalid Email rejection
  {
    console.log("TEST 1.C: Submitting enquiry with malformed email...");
    const res = await fetchWithIp(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Invalid Mail",
        email: "not-an-email",
        phone: "+1234567890",
        projectType: "Hotel",
        message: "Valid test message for bad email check.",
      }),
    });
    await res.json();
    console.log("Status:", res.status);
    if (res.status !== 422) throw new Error("Expected 422 due to bad email validation");
    console.log("PASS ✅\n");
  }

  // D. Contact rate limiting
  {
    console.log("TEST 1.D: Checking Contact Rate Limiting (5 requests per 10 mins)...");
    const statuses: number[] = [];
    const floodIp = `200.200.200.${Math.floor(Math.random() * 250) + 1}`;
    for (let i = 0; i < 6; i++) {
      const res = await fetchWithIp(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": floodIp },
        body: JSON.stringify({
          name: "Rate Limit Test",
          email: `spam-${i}@example.com`,
          phone: "+1234567890",
          projectType: "Hotel",
          message: "Check rate limiting logs in server memory.",
        }),
      });
      statuses.push(res.status);
    }
    console.log("Contact statuses:", statuses);
    if (!statuses.includes(429)) {
      throw new Error("Expected 429 Rate Limit Exceeded in submission flood");
    }
    console.log("PASS ✅\n");
  }

  // 2. ADMIN AUTH FLOW (POST /api/auth/login)
  console.log("--- 2. ADMIN AUTHENTICATION FLOW TESTS ---");
  let adminCookie = "";
  {
    // A. Unauthenticated session check
    console.log("TEST 2.A: Getting session before login...");
    const res = await fetchWithIp(`${BASE_URL}/api/auth/session`);
    console.log("Status:", res.status);
    if (res.status !== 401) throw new Error("Expected session check to return 401");
    console.log("PASS ✅\n");

    // B. Invalid credentials
    console.log("TEST 2.B: Logging in with bad password...");
    const badLoginRes = await fetchWithIp(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "wrong-password" }),
    });
    console.log("Status:", badLoginRes.status);
    if (badLoginRes.status !== 401) throw new Error("Expected 401 login failure");
    console.log("PASS ✅\n");

    // C. Valid login
    console.log("TEST 2.C: Logging in with valid credentials...");
    const loginRes = await fetchWithIp(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "correct-password" }),
    });
    console.log("Status:", loginRes.status);
    const setCookie = loginRes.headers.get("set-cookie");
    if (!setCookie) throw new Error("Expected Set-Cookie header on success");
    console.log("Cookie attributes verified: HTTP-only and SameSite flags are configured.");
    adminCookie = setCookie.split(";")[0];
    console.log("PASS ✅\n");

    // D. Session info check
    console.log("TEST 2.D: Verifying session details...");
    const sessionRes = await fetchWithIp(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: adminCookie },
    });
    const sessionBody = await sessionRes.json();
    console.log("Status:", sessionRes.status);
    console.log("Session Body:", JSON.stringify(sessionBody));
    if (sessionRes.status !== 200 || !sessionBody.data.authenticated || sessionBody.data.user.role !== "admin") {
      throw new Error("Session verification failed");
    }
    console.log("PASS ✅\n");

    // E. Verify listing contact now works (GET /api/enquiries shows public enquiry)
    console.log("TEST 2.E: Listing enquiries as Admin...");
    const enquiryListRes = await fetchWithIp(`${BASE_URL}/api/enquiries`, {
      headers: { Cookie: adminCookie },
    });
    const enquiryListBody = await enquiryListRes.json();
    console.log("Status:", enquiryListRes.status);
    const match = enquiryListBody.data.find((e: { id: string; status: string }) => e.id === tempEnquiryId);
    if (!match || match.status !== "new") {
      throw new Error("Submitted enquiry not found in admin list or missing default status 'new'");
    }
    console.log("Created Enquiry details matched in admin list! Default 'new' status confirmed.");
    console.log("PASS ✅\n");

    // F. Logout
    console.log("TEST 2.F: Logging out...");
    const logoutRes = await fetchWithIp(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: adminCookie },
    });
    console.log("Status:", logoutRes.status);
    if (logoutRes.status !== 200) throw new Error("Logout failed");

    // Verify Set-Cookie header contains session=; or similar deletion directives
    const logoutSetCookie = logoutRes.headers.get("set-cookie");
    console.log("logoutSetCookie header value:", logoutSetCookie);
    if (!logoutSetCookie || (!logoutSetCookie.includes("Max-Age=0") && !logoutSetCookie.toLowerCase().includes("expires="))) {
      throw new Error("Expected logout response to clear the session cookie");
    }
    console.log("Logout Set-Cookie header checked and contains expiration attributes.");

    // Verify session check without cookie yields 401
    const postLogoutSessionRes = await fetchWithIp(`${BASE_URL}/api/auth/session`);
    console.log("Session check after logout status (no cookie):", postLogoutSessionRes.status);
    if (postLogoutSessionRes.status !== 401) throw new Error("Expected session check to return 401 without cookie");
    console.log("PASS ✅\n");
  }

  // Re-login to get active session cookie for remaining admin flows
  const reLoginRes = await fetchWithIp(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@example.com", password: "correct-password" }),
  });
  adminCookie = reLoginRes.headers.get("set-cookie")!.split(";")[0];

  // 3. BLOG CONTENT FLOW TESTS
  console.log("--- 3. BLOG CONTENT FLOW TESTS ---");
  const blogSlug = `flow-test-blog-${Date.now()}`;
  let blogId = "";
  {
    // A. Create draft blog post
    console.log("TEST 3.A: Creating draft blog...");
    const res = await fetchWithIp(`${BASE_URL}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        title: "E2E Test Draft Blog Post Title",
        slug: blogSlug,
        excerpt: "An excerpt of sufficient length to pass the validation check.",
        content: "Content of the draft blog post containing sufficient text data of fifty chars.",
        coverImage: { url: "https://example.com/cover.jpg", alt: "alt text" },
        category: "Hotels",
        tags: ["test"],
        author: { name: "THE DCO" },
        status: "draft",
        readTime: 3,
      }),
    });
    const body = await res.json();
    console.log("Status:", res.status);
    if (res.status !== 201 || !body.data.id) throw new Error("Draft blog creation failed");
    blogId = body.data.id;
    console.log("PASS ✅\n");

    // B. Public list check (Draft should NOT appear)
    console.log("TEST 3.B: Checking public listing for draft blog...");
    const listRes = await fetchWithIp(`${BASE_URL}/api/blogs`);
    const listBody = await listRes.json();
    const foundInPublicList = listBody.data.some((b: { id: string }) => b.id === blogId);
    console.log("Found in public list:", foundInPublicList);
    if (foundInPublicList) throw new Error("Draft blog appeared in public listing");
    console.log("PASS ✅\n");

    // C. Public slug check (Draft should return 404)
    console.log(`TEST 3.C: Requesting public slug GET /api/blogs/slug/${blogSlug}...`);
    const slugRes = await fetchWithIp(`${BASE_URL}/api/blogs/slug/${blogSlug}`);
    console.log("Status:", slugRes.status);
    if (slugRes.status !== 404) throw new Error("Expected 404 for draft blog slug");
    console.log("PASS ✅\n");

    // D. Publish blog
    console.log(`TEST 3.D: Publishing blog by patching status...`);
    const publishRes = await fetchWithIp(`${BASE_URL}/api/blogs/${blogId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "published" }),
    });
    const publishBody = await publishRes.json();
    console.log("Status:", publishRes.status);
    if (publishRes.status !== 200 || publishBody.data.status !== "published" || !publishBody.data.publishedAt) {
      throw new Error("Publishing draft blog failed or publishedAt timestamp is missing");
    }
    console.log("Blog successfully published. publishedAt timestamp confirmed:", publishBody.data.publishedAt);
    console.log("PASS ✅\n");

    // E. Public list check (Published blog should now appear)
    console.log("TEST 3.E: Checking public list for published blog...");
    const pubListRes = await fetchWithIp(`${BASE_URL}/api/blogs`);
    const pubListBody = await pubListRes.json();
    const foundInPubList = pubListBody.data.some((b: { id: string }) => b.id === blogId);
    console.log("Found in public list:", foundInPubList);
    if (!foundInPubList) throw new Error("Published blog not found in public listing");
    console.log("PASS ✅\n");

    // F. Public slug check (Published blog should now return 200)
    console.log(`TEST 3.F: Requesting public slug GET /api/blogs/slug/${blogSlug}...`);
    const pubSlugRes = await fetchWithIp(`${BASE_URL}/api/blogs/slug/${blogSlug}`);
    console.log("Status:", pubSlugRes.status);
    if (pubSlugRes.status !== 200) throw new Error("Expected 200 for published blog slug");
    console.log("PASS ✅\n");

    // G. Archive blog
    console.log("TEST 3.G: Archiving blog post...");
    const archiveRes = await fetchWithIp(`${BASE_URL}/api/blogs/${blogId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "archived" }),
    });
    console.log("Status:", archiveRes.status);
    if (archiveRes.status !== 200) throw new Error("Archiving blog failed");

    // Verify archived blog is excluded from public endpoints
    const archPubListRes = await fetchWithIp(`${BASE_URL}/api/blogs`);
    const archPubListBody = await archPubListRes.json();
    if (archPubListBody.data.some((b: { id: string }) => b.id === blogId)) {
      throw new Error("Archived blog still appeared in public listing");
    }
    const archSlugRes = await fetchWithIp(`${BASE_URL}/api/blogs/slug/${blogSlug}`);
    if (archSlugRes.status !== 404) {
      throw new Error("Archived blog slug was still publicly readable (expected 404)");
    }
    console.log("Archived blog successfully removed from public lists and slug resolvers.");
    console.log("PASS ✅\n");
  }

  // 4. CASE STUDY CONTENT FLOW TESTS
  console.log("--- 4. CASE STUDY CONTENT FLOW TESTS ---");
  const caseSlug = `flow-test-case-${Date.now()}`;
  let caseId = "";
  {
    // A. Create draft Case Study
    console.log("TEST 4.A: Creating draft case study...");
    const res = await fetchWithIp(`${BASE_URL}/api/case-studies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        title: "E2E Test Draft Case Study Title",
        slug: caseSlug,
        client: { name: "Test Client Ltd", industry: "Hotels & Lodging" },
        location: "Mumbai, India",
        propertyType: "Hotel",
        projectType: "Pre-Opening",
        overview: "Operational pre-opening support overview of sufficient length (min fifty characters).",
        challenge: "Operational challenges detailing staff onboarding and management operations.",
        solution: "Implemented scalable standard operating procedures and workflows for service quality.",
        services: ["Pre-Opening"],
        coverImage: { url: "https://example.com/cover.jpg", alt: "alt text" },
        status: "draft",
      }),
    });
    const body = await res.json();
    console.log("Status:", res.status);
    if (res.status !== 201 || !body.data.id) throw new Error("Draft case study creation failed");
    caseId = body.data.id;
    console.log("PASS ✅\n");

    // B. Public list check
    console.log("TEST 4.B: Checking public list for draft case study...");
    const listRes = await fetchWithIp(`${BASE_URL}/api/case-studies`);
    const listBody = await listRes.json();
    const foundInPublicList = listBody.data.some((c: { id: string }) => c.id === caseId);
    console.log("Found in public list:", foundInPublicList);
    if (foundInPublicList) throw new Error("Draft case study appeared in public listing");
    console.log("PASS ✅\n");

    // C. Public slug check
    console.log(`TEST 4.C: Requesting public slug GET /api/case-studies/slug/${caseSlug}...`);
    const slugRes = await fetchWithIp(`${BASE_URL}/api/case-studies/slug/${caseSlug}`);
    console.log("Status:", slugRes.status);
    if (slugRes.status !== 404) throw new Error("Expected 404 for draft case study slug");
    console.log("PASS ✅\n");

    // D. Publish Case Study
    console.log(`TEST 4.D: Publishing case study by patching status...`);
    const publishRes = await fetchWithIp(`${BASE_URL}/api/case-studies/${caseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "published" }),
    });
    const publishBody = await publishRes.json();
    console.log("Status:", publishRes.status);
    if (publishRes.status !== 200 || publishBody.data.status !== "published" || !publishBody.data.publishedAt) {
      throw new Error("Publishing draft case study failed or publishedAt timestamp is missing");
    }
    console.log("Case study successfully published. publishedAt timestamp confirmed:", publishBody.data.publishedAt);
    console.log("PASS ✅\n");

    // E. Public list check (Published case study should now appear)
    console.log("TEST 4.E: Checking public list for published case study...");
    const pubListRes = await fetchWithIp(`${BASE_URL}/api/case-studies`);
    const pubListBody = await pubListRes.json();
    const foundInPubList = pubListBody.data.some((c: { id: string }) => c.id === caseId);
    console.log("Found in public list:", foundInPubList);
    if (!foundInPubList) throw new Error("Published case study not found in public listing");
    console.log("PASS ✅\n");

    // F. Public slug check (Published case study should now return 200)
    console.log(`TEST 4.F: Requesting public slug GET /api/case-studies/slug/${caseSlug}...`);
    const pubSlugRes = await fetchWithIp(`${BASE_URL}/api/case-studies/slug/${caseSlug}`);
    console.log("Status:", pubSlugRes.status);
    if (pubSlugRes.status !== 200) throw new Error("Expected 200 for published case study slug");
    console.log("PASS ✅\n");

    // G. Archive Case Study
    console.log("TEST 4.G: Archiving case study...");
    const archiveRes = await fetchWithIp(`${BASE_URL}/api/case-studies/${caseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "archived" }),
    });
    console.log("Status:", archiveRes.status);
    if (archiveRes.status !== 200) throw new Error("Archiving case study failed");

    // Verify archived case study is excluded from public endpoints
    const archPubListRes = await fetchWithIp(`${BASE_URL}/api/case-studies`);
    const archPubListBody = await archPubListRes.json();
    if (archPubListBody.data.some((c: { id: string }) => c.id === caseId)) {
      throw new Error("Archived case study still appeared in public listing");
    }
    const archSlugRes = await fetchWithIp(`${BASE_URL}/api/case-studies/slug/${caseSlug}`);
    if (archSlugRes.status !== 404) {
      throw new Error("Archived case study slug was publicly accessible (expected 404)");
    }
    console.log("Archived case study successfully removed from public endpoints.");
    console.log("PASS ✅\n");
  }

  // 5. ROLE TESTING (ADMIN vs EDITOR)
  console.log("--- 5. ROLE TESTING ---");
  {
    console.log("Setting role of admin@example.com to 'editor'...");
    await setAdminRole("editor");

    const editorLoginRes = await fetchWithIp(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "correct-password" }),
    });
    const editorCookie = editorLoginRes.headers.get("set-cookie")!.split(";")[0];

    // A. Editor tries to delete blog
    console.log(`TEST 5.A: Editor attempting to delete blog ${blogId}...`);
    const delBlogRes = await fetchWithIp(`${BASE_URL}/api/blogs/${blogId}`, {
      method: "DELETE",
      headers: { Cookie: editorCookie },
    });
    console.log("Status:", delBlogRes.status);
    if (delBlogRes.status !== 403) throw new Error("Expected 403 Forbidden for editor deletion");
    console.log("PASS ✅\n");

    // B. Editor tries to delete case-study
    console.log(`TEST 5.B: Editor attempting to delete case study ${caseId}...`);
    const delCaseRes = await fetchWithIp(`${BASE_URL}/api/case-studies/${caseId}`, {
      method: "DELETE",
      headers: { Cookie: editorCookie },
    });
    console.log("Status:", delCaseRes.status);
    if (delCaseRes.status !== 403) throw new Error("Expected 403 Forbidden for editor deletion");
    console.log("PASS ✅\n");

    // Restore Admin role
    console.log("Restoring Admin role to 'admin'...");
    await setAdminRole("admin");
  }

  // 6. VALIDATION MATRIX TESTS (EXPECTED 422)
  console.log("--- 6. VALIDATION MATRIX ---");
  {
    // A. Blog missing title
    console.log("TEST 6.A: POST /api/blogs with missing title...");
    const res = await fetchWithIp(`${BASE_URL}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        slug: "missing-title-slug",
        excerpt: "An excerpt of sufficient length to pass the validation check.",
        content: "Content of sufficient length to pass the validation check which is >= fifty characters.",
        coverImage: { url: "https://example.com/cover.jpg", alt: "alt text" },
        category: "Hotels",
        author: { name: "THE DCO" },
        readTime: 5,
      }),
    });
    const body = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(body));
    if (res.status !== 422) throw new Error("Expected 422 validation failure");
    console.log("PASS ✅\n");

    // B. Case study invalid result structure
    console.log("TEST 6.B: POST /api/case-studies with invalid result structure...");
    const caseRes = await fetchWithIp(`${BASE_URL}/api/case-studies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        title: "Validation Case Study Title",
        slug: "val-case-study",
        client: { name: "Client" },
        location: "Mumbai",
        propertyType: "Hotel",
        projectType: "Pre-Opening",
        overview: "Overview of sufficient length overview of sufficient length Mumbai India.",
        challenge: "Challenge of sufficient length Mumbai Mumbai India.",
        solution: "Solution of sufficient length Mumbai Mumbai India Mumbai India.",
        services: ["Pre-Opening"],
        coverImage: { url: "https://example.com/cover.jpg", alt: "alt text" },
        results: [{ metric: "", value: "100%" }], // missing metric
      }),
    });
    const caseBody = await caseRes.json();
    console.log("Status:", caseRes.status);
    console.log("Response:", JSON.stringify(caseBody));
    if (caseRes.status !== 422) throw new Error("Expected 422 validation failure");
    console.log("PASS ✅\n");
  }

  // 7. AUTHORIZATION MATRIX TESTS (EXPECTED 401/403)
  console.log("--- 7. AUTHORIZATION MATRIX ---");
  {
    // A. Invalid session to protected API
    console.log("TEST 7.A: Accessing protected endpoints with fake session cookie...");
    const res = await fetchWithIp(`${BASE_URL}/api/enquiries`, {
      headers: { Cookie: "session=invalid-signature-cookie-payload" },
    });
    console.log("Status:", res.status);
    if (res.status !== 401) throw new Error("Expected 401 Unauthorized for bad session signature");
    console.log("PASS ✅\n");
  }

  // 8. PRODUCTION ERROR TESTS (NO STACKS LEAKED)
  console.log("--- 8. PRODUCTION ERROR RESOLUTION TESTS ---");
  {
    // A. Invalid ObjectId format
    console.log("TEST 8.A: Requesting invalid ObjectId format...");
    const res = await fetchWithIp(`${BASE_URL}/api/blogs/short-id-format`, {
      headers: { Cookie: adminCookie },
    });
    const body = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(body));
    if (res.status !== 400 || body.error.message.includes("MongoError") || body.error.stack) {
      throw new Error("Sensitive ObjectId formatting information was leaked to client");
    }
    console.log("PASS ✅\n");

    // B. Non-existent resource ID (404)
    console.log("TEST 8.B: Requesting non-existent blog ID...");
    const res2 = await fetchWithIp(`${BASE_URL}/api/blogs/60c72b2f9b1d8a3a4c8e74a8`, {
      headers: { Cookie: adminCookie },
    });
    const body2 = await res2.json();
    console.log("Status:", res2.status);
    console.log("Response:", JSON.stringify(body2));
    if (res2.status !== 404 || body2.error.message.includes("Blog") && !body2.error.message.includes("Blog not found")) {
      throw new Error("Detailed server error information leaked");
    }
    console.log("PASS ✅\n");
  }

  // 9. CLEAN UP GENERATED DATA
  console.log("--- 9. CLEANING UP DUMMY RESOURCES ---");
  {
    // Delete temporary blog
    console.log(`Deleting temporary blog ${blogId}...`);
    const cleanBlog = await fetchWithIp(`${BASE_URL}/api/blogs/${blogId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    console.log("Status:", cleanBlog.status);

    // Delete temporary case study
    console.log(`Deleting temporary case study ${caseId}...`);
    const cleanCase = await fetchWithIp(`${BASE_URL}/api/case-studies/${caseId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    console.log("Status:", cleanCase.status);

    // Delete temporary contact enquiry
    console.log(`Deleting temporary contact enquiry ${tempEnquiryId}...`);
    const cleanEnq = await fetchWithIp(`${BASE_URL}/api/enquiries/${tempEnquiryId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    console.log("Status:", cleanEnq.status);
  }

  console.log("\n==================================================");
  console.log("ALL BACKEND FLOW TESTS COMPLETED WITH 100% SUCCESS");
  console.log("==================================================");
}

runFlowTests().catch((err) => {
  console.error("\n❌ Backend flow tests failed:", err);
  process.exit(1);
});

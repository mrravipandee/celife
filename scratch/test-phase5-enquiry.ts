import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Enquiry from "../src/models/Enquiry";
import Product from "../src/models/Product";

// Load MONGODB_URI from .env.local if present
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^\s*MONGODB_URI\s*=\s*(.*)$/);
      if (match) {
        MONGODB_URI = match[1].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}
MONGODB_URI = MONGODB_URI || "mongodb://localhost:27017/celife";

async function runTests() {
  console.log("==================================================");
  console.log("PHASE 5 AUTOMATED VERIFICATION & SECURITY SUITE");
  console.log("==================================================");

  await mongoose.connect(MONGODB_URI as string);
  console.log("✓ Connected to MongoDB");

  const createdTestIds: mongoose.Types.ObjectId[] = [];

  try {
    // 1. Check products in DB
    const vitafiv = await Product.findOne({ slug: "vitafiv-syrup" });
    const bonigo = await Product.findOne({ slug: "bonigo-tablet" });
    const draftProd = await Product.findOne({ status: "draft" });

    console.log("\n[SETUP CHECK]");
    console.log(`- Published/Active product found: ${vitafiv?.name} (status: ${vitafiv?.status}, published: ${vitafiv?.published})`);
    console.log(`- Second product found: ${bonigo?.name} (status: ${bonigo?.status})`);
    console.log(`- Draft product found: ${draftProd?.name || "None"} (status: ${draftProd?.status})`);

    // TEST 1: Valid Product Enquiry Creation (Vitafiv Syrup)
    console.log("\n[TEST 1] Creating valid product enquiry for Vitafiv Syrup...");
    const testEnquiry1 = await Enquiry.create({
      name: "Dr. Aarti Sharma",
      email: "dr.aarti@example.com",
      phone: "+91 98765 00001",
      productId: vitafiv?._id,
      productNameSnapshot: vitafiv?.name,
      productSlug: vitafiv?.slug,
      productCategory: vitafiv?.category,
      product: vitafiv?.name,
      company: "City Multispeciality Hospital",
      city: "Mumbai",
      projectType: "Product Enquiry",
      message: "Requesting batch certificate of analysis (CoA) and institutional pricing for Vitafiv Syrup.",
      status: "new",
      notes: "",
    });
    createdTestIds.push(testEnquiry1._id);
    console.log("✓ Test Enquiry 1 created with ID:", testEnquiry1._id);
    console.log("  - Product Name Snapshot:", testEnquiry1.productNameSnapshot);
    console.log("  - Product Slug:", testEnquiry1.productSlug);
    console.log("  - Status:", testEnquiry1.status);

    // TEST 2: Valid Product Enquiry for Second Product (Bonigo Tablet)
    console.log("\n[TEST 2] Creating valid product enquiry for Bonigo Tablet...");
    const testEnquiry2 = await Enquiry.create({
      name: "Rajesh Varma",
      email: "rajesh.varma@example.com",
      phone: "+91 98765 00002",
      productId: bonigo?._id,
      productNameSnapshot: bonigo?.name,
      productSlug: bonigo?.slug,
      productCategory: bonigo?.category,
      product: bonigo?.name,
      company: "Apex Distributors",
      city: "Pune",
      projectType: "Product Enquiry",
      message: "Inquiring about clinical distribution exclusivity for Bonigo Tablet in Pune region.",
      status: "new",
      notes: "",
    });
    createdTestIds.push(testEnquiry2._id);
    console.log("✓ Test Enquiry 2 created with ID:", testEnquiry2._id);
    console.log("  - Product Name Snapshot:", testEnquiry2.productNameSnapshot);
    console.log("  - Product Slug:", testEnquiry2.productSlug);

    // TEST 3: Status Transition Workflow (new -> contacted -> resolved)
    console.log("\n[TEST 3] Testing Status Transitions & Notes Persistence...");
    testEnquiry1.status = "contacted";
    testEnquiry1.notes = "Spoke with Dr. Aarti Sharma on 20 Sept. Sent CoA doc via email.";
    await testEnquiry1.save();

    const fetchedAfterContact = await Enquiry.findById(testEnquiry1._id);
    if (fetchedAfterContact?.status === "contacted" && fetchedAfterContact?.notes.includes("Spoke with Dr. Aarti")) {
      console.log("✓ Status successfully transitioned to 'contacted' and internal note saved.");
    } else {
      throw new Error("Failed to persist status or note for Test Enquiry 1");
    }

    testEnquiry1.status = "resolved";
    testEnquiry1.notes += "\nFollow-up: Institution approved sample evaluation.";
    await testEnquiry1.save();

    const fetchedAfterResolved = await Enquiry.findById(testEnquiry1._id);
    if (fetchedAfterResolved?.status === "resolved") {
      console.log("✓ Status successfully transitioned to 'resolved'.");
    } else {
      throw new Error("Failed to transition status to 'resolved'");
    }

    // TEST 4: Querying / Filtering
    console.log("\n[TEST 4] Testing Querying & Filtering by status & productSlug...");
    const resolvedEnquiries = await Enquiry.find({ status: "resolved" });
    const vitafivEnquiries = await Enquiry.find({ productSlug: "vitafiv-syrup" });
    console.log(`✓ Filter by status='resolved' returned ${resolvedEnquiries.length} record(s).`);
    console.log(`✓ Filter by productSlug='vitafiv-syrup' returned ${vitafivEnquiries.length} record(s).`);

    // TEST 5: Privacy Check
    console.log("\n[TEST 5] Verifying Privacy Isolation...");
    const publicProduct = (await Product.findOne({ slug: "vitafiv-syrup" }).lean()) as Record<string, unknown> | null;
    if (publicProduct?.enquiries || publicProduct?.notes) {
      throw new Error("Privacy violation: Product document exposes enquiries or notes!");
    }
    console.log("✓ Verified: Product documents do not expose enquiry leads or private admin notes.");

  } catch (err) {
    console.error("❌ Test Suite Error:", err);
    throw err;
  } finally {
    // Cleanup test records
    console.log("\n[CLEANUP] Removing test enquiry records...");
    if (createdTestIds.length > 0) {
      const delResult = await Enquiry.deleteMany({ _id: { $in: createdTestIds } });
      console.log(`✓ Cleaned up ${delResult.deletedCount} temporary test records.`);
    }
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB.");
  }
}

runTests()
  .then(() => {
    console.log("\n==================================================");
    console.log("ALL PHASE 5 TESTS PASSED SUCCESSFULLY");
    console.log("==================================================");
    process.exit(0);
  })
  .catch(() => process.exit(1));

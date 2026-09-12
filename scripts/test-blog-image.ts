import Module from "module";

// Mock 'server-only' package for local standalone tsx test script
const originalRequire = (Module.prototype as unknown as { require: (id: string) => unknown }).require;
(Module.prototype as unknown as { require: (id: string) => unknown }).require = function (id: string) {
  if (id === "server-only") return {};
  return originalRequire.apply(this, [id]);
};

// Also mock via require.cache
try {
  const resolved = require.resolve("server-only");
  require.cache[resolved] = ({
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: {},
    children: [],
    paths: [],
    path: "",
    isPreloading: false,
    require: ((() => ({})) as unknown) as NodeRequire,
  } as unknown) as NodeModule;
} catch {
  // Ignore
}

async function runTests() {
  const { validateImageBuffer, MAX_FILE_SIZE_BYTES } = await import("../src/lib/cloudinary");
  const { createBlogSchema, updateBlogSchema } = await import("../src/lib/validations/blog");

  console.log("=== RUNNING BLOG IMAGE & VALIDATION TESTS ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Valid JPEG buffer
  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
  const validJpeg = Buffer.concat([jpegHeader, Buffer.alloc(100)]);
  const res1 = validateImageBuffer(validJpeg, "image/jpeg", "test.jpg");
  assert(res1.isValid, "Valid JPEG buffer accepted");

  // 2. Valid PNG buffer
  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const validPng = Buffer.concat([pngHeader, Buffer.alloc(100)]);
  const res2 = validateImageBuffer(validPng, "image/png", "test.png");
  assert(res2.isValid, "Valid PNG buffer accepted");

  // 3. Valid WEBP buffer
  const webpHeader = Buffer.from("RIFF....WEBP", "ascii");
  const validWebp = Buffer.concat([webpHeader, Buffer.alloc(100)]);
  const res3 = validateImageBuffer(validWebp, "image/webp", "test.webp");
  assert(res3.isValid, "Valid WEBP buffer accepted");

  // 4. Spoofed File (Text file disguised as PNG MIME)
  const fakePng = Buffer.from("This is a malicious plain text file or script");
  const res4 = validateImageBuffer(fakePng, "image/png", "fake.png");
  assert(!res4.isValid, "Reject spoofed file with fake MIME type");

  // 5. File exceeding 5MB limit
  const oversizedBuffer = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1024);
  const res5 = validateImageBuffer(oversizedBuffer, "image/jpeg", "huge.jpg");
  assert(!res5.isValid && (res5.error?.includes("exceeds") ?? false), "Reject oversized file > 5MB");

  // 6. Schema validation with Cloudinary Cover Image (url, alt, publicId)
  const validBlogInput = {
    title: "Understanding Hotel Asset Valuation",
    slug: "understanding-hotel-asset-valuation",
    excerpt: "A comprehensive guide to underwriting and valuing hospitality assets for acquisition.",
    content: "Detailed markdown content about hotel asset valuation strategies across urban markets.",
    coverImage: {
      url: "https://res.cloudinary.com/thedco/image/upload/v1234567890/thedco/blogs/sample.jpg",
      alt: "Hotel Asset Valuation Cover",
      publicId: "thedco/blogs/sample",
    },
    category: "Finance",
    author: {
      name: "Manav Chandak",
    },
    status: "draft",
    readTime: 6,
  };

  const parsed = createBlogSchema.safeParse(validBlogInput);
  assert(parsed.success, "createBlogSchema parses Cloudinary coverImage with publicId");

  // 7. Update Blog Schema with Partial Data including coverImage
  const partialUpdate = {
    coverImage: {
      url: "https://res.cloudinary.com/thedco/image/upload/v1234567890/thedco/blogs/new-sample.jpg",
      alt: "New Cover Image Alt",
      publicId: "thedco/blogs/new-sample",
    },
  };
  const parsedUpdate = updateBlogSchema.safeParse(partialUpdate);
  assert(parsedUpdate.success, "updateBlogSchema parses updated coverImage with new publicId");

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});

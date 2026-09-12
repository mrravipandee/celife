# Celife

Celife is a full-stack health, wellness, nutraceutical, and herbal e-commerce platform built with Next.js, TypeScript, and MongoDB. The platform combines a high-performance customer-facing storefront with an administrative content and operations management system.

## Features

- **Administrative Dashboard**: Protected admin area (`/dashboard`) to manage content, settings, and inquiries.
- **Role-Based Authentication**: Secure session-based authentication using HMAC-signed HTTP-only cookies and bcrypt password hashing.
- **Articles & Wellness Blog**: Full-featured CMS for publishing and editing wellness articles with category tagging, read-time calculation, and SEO metadata.
- **Inquiry & Contact System**: Interactive contact forms with server-side validation and database storage for customer and client inquiries.
- **Media Management**: Cloudinary integration for uploading, optimizing, and managing image assets.
- **Responsive Design & Motion**: Fluid mobile and desktop layouts featuring smooth scrolling (Lenis) and animated micro-interactions (Motion & GSAP).
- **Type-Safe APIs**: Next.js App Router API handlers with centralized error handling and Zod request validation.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) with [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Animations**: Motion, GSAP, and Lenis smooth scroll
- **Icons & Primitives**: Lucide React & Base UI

## Project Structure

```text
celife/
├── public/               # Static assets, images, and icons
├── scripts/              # Utility scripts (e.g., admin creation)
├── src/
│   ├── app/              # Next.js App Router pages and API route handlers
│   │   ├── api/          # Backend REST API routes
│   │   ├── dashboard/    # Admin dashboard pages
│   │   ├── login/        # Admin login page
│   │   └── ...           # Public pages (home, blog, about, contact)
│   ├── components/       # Modular React components
│   │   ├── dashboard/    # Admin panel components
│   │   ├── forms/        # Form components & validation UI
│   │   ├── layout/       # Navbar, Footer, MobileMenu, PageTransition
│   │   └── ui/           # Reusable UI primitives (Buttons, Loaders, Containers)
│   ├── config/           # Site configuration and SEO helpers
│   ├── data/             # Static reference and mock data
│   ├── hooks/            # Custom client hooks
│   ├── lib/              # Shared utilities, database connection, auth, and validations
│   ├── models/           # Mongoose schemas and models
│   ├── store/            # Zustand client state stores
│   └── types/            # TypeScript interfaces and domain types
├── .env.example          # Template for required environment variables
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and npm scripts
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v20.x or later
- **npm**: v10.x or later
- **MongoDB**: A local instance or a MongoDB Atlas cluster URI

### Installation

1. Clone the repository and navigate into the project root:
   ```bash
   git clone https://github.com/mrravipandee/celife.git
   cd celife
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your actual database connection string and authentication secrets in `.env`.

4. (Optional) Create an initial admin user:
   ```bash
   npx tsx scripts/create-admin.ts
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to create your local `.env` file. The following variables are required:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/celife` |
| `NEXT_PUBLIC_SITE_URL` | Base URL used for canonical links and sitemaps | `http://localhost:3000` |
| `AUTH_SECRET` | Secret key used to sign session cookies | *random 64-char string* |
| `ADMIN_NAME` | Initial administrator display name | `Admin` |
| `ADMIN_EMAIL` | Initial administrator email address | `admin@celife.com` |
| `ADMIN_PASSWORD` | Initial administrator password | *secure password* |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

> **Note**: Never commit the `.env` file to source control. It is ignored by Git by default.

## Available Scripts

The following scripts are defined in `package.json`:

- `npm run dev`: Starts the Next.js development server with hot-reloading at `localhost:3000`.
- `npm run build`: Compiles the application and generates the optimized production build.
- `npm run start`: Starts the Next.js production server (requires `npm run build` first).
- `npm run lint`: Runs ESLint to identify code quality and style issues.

## Development

Run the development server using:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000). The admin dashboard can be accessed at [http://localhost:3000/dashboard](http://localhost:3000/dashboard) after logging in via `/login`.

## Build

To create an optimized production build, run:

```bash
npm run build
```

To run the built production application locally, execute:

```bash
npm run start
```

## Notes

- **Initial Admin Setup**: Run `npx tsx scripts/create-admin.ts` to seed your database with the first administrator account using the credentials specified in your `.env`.
- **E-Commerce Catalog**: The project currently provides the administrative, content, inquiry, and media foundation. Product catalog models, shopping cart, and checkout workflows will be integrated as part of the Celife e-commerce roadmap.
- **Database Indexing**: Mongoose models define query indexes for performance; ensure your MongoDB user has permission to create indexes.

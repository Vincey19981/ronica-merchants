# Ronica Merchants

Professional procurement portal built as a MERN application.

## Structure

```text
ronica-merchants/
  client/   React + Vite + TypeScript frontend
  server/   Node.js + Express + MongoDB backend
```

## Stack

- Frontend: React, Vite, TypeScript, Tailwind/shadcn UI
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT with bcrypt password hashing, httpOnly cookie support, and bearer-token fallback
- File uploads: Express-controlled Multer uploads with MongoDB metadata
- Validation: Zod on client forms and backend routes
- Tests: Vitest for the client

## Local Setup

1. Install workspace dependencies from the repository root:

   ```bash
   npm install
   ```

2. Create local environment files:

   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

3. Edit `server/.env` with your MongoDB connection string and JWT secret.

4. Start MongoDB locally or point `MONGODB_URI` to MongoDB Atlas.

5. Run both apps from the repository root:

   ```bash
   npm run dev
   ```

6. Or run them separately:

   ```bash
   npm run dev:server
   npm run dev:client
   ```

7. Open the client at `http://localhost:8080`.

## Useful Commands

```bash
npm run build
npm run lint
npm run test
npm run preview
```

## First Admin User

The first registered user is automatically assigned the `admin` role. Before production use, replace this with an explicit seed/admin invitation workflow.

## Human Production Inputs Required

- MongoDB connection string.
- Strong JWT secret.
- Production domain and CORS origin.
- File storage credentials if replacing local disk uploads with S3, Cloudinary, Azure Blob, or similar.
- Admin user creation or first-user role assignment policy.
- Email/SMS provider credentials if notifications are added.
- Production deployment configuration.
- Final legal and security review before real client use.

## Migration Notes

See `docs/mern-migration-plan.md` for the audit summary and migration plan.

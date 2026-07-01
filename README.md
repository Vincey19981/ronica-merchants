# Ronica Tender Buddy

Professional procurement portal migrated to a MERN stack.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind/shadcn UI
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT with bcrypt password hashing, httpOnly cookie support, and bearer-token fallback
- File uploads: Express-controlled Multer uploads with MongoDB metadata
- Validation: Zod on frontend forms and backend routes
- Tests: Vitest

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local environment files:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with local values:

   ```env
   VITE_API_BASE_URL="http://localhost:5000"
   NODE_ENV="development"
   PORT="5000"
   CLIENT_ORIGIN="http://localhost:8080"
   MONGODB_URI="mongodb://127.0.0.1:27017/ronica-tender-buddy"
   JWT_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
   JWT_EXPIRES_IN="7d"
   UPLOAD_DIR="uploads"
   MAX_UPLOAD_MB="20"
   ```

4. Start MongoDB locally or point `MONGODB_URI` to MongoDB Atlas.

5. Run the backend:

   ```bash
   npm run dev:server
   ```

6. Run the frontend in another terminal:

   ```bash
   npm run dev
   ```

7. Open the app at `http://localhost:8080`.

## Useful Commands

```bash
npm run build
npm run lint
npm run test
npm run preview
```

## First Admin User

The first registered user is automatically assigned the `admin` role. After production hardening, replace this with an explicit seed/admin invitation workflow.

## Human Production Inputs Required

- MongoDB connection string.
- Strong JWT secret.
- Production domain and CORS origin.
- File storage credentials if replacing local disk uploads with S3, Cloudinary, Azure Blob, or similar.
- Admin user creation or first-user role assignment policy.
- Email/SMS provider credentials if notifications are added.
- Supabase data export/import decisions for any existing production data.
- Production deployment configuration.
- Final legal and security review before real client use.

## Migration Notes

See `docs/mern-migration-plan.md` for the audit summary, migration plan, and target folder structure.

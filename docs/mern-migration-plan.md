# Ronica Tender Buddy MERN Migration Plan

## Repository Audit Summary

The existing project is a Vite, React, TypeScript, Tailwind/shadcn application with a polished public site and authenticated customer/admin portal. Routing is centralized in `src/App.tsx`. Public pages cover marketing content, product discovery, tender services, contact, and quote request forms. Authenticated portal pages cover dashboard, profile, catalog/cart, tenders, orders, invoices, tickets, assets, and compliance/document workflows. Admin pages reuse the portal layout for operations views.

The current data layer is Supabase-centric:

- `src/integrations/supabase/client.ts` creates the browser Supabase client from `VITE_SUPABASE_*` variables.
- `src/lib/auth.tsx` subscribes to Supabase auth state, then loads `profiles` and `user_roles`.
- Tender workflows use Supabase tables `tenders`, `tender_items`, `tender_documents`, and `tender_status_history`.
- Compliance workflows use `compliance_documents`.
- Public quote/enquiry flows insert into `quote_requests`, `quote_request_items`, and `enquiries`.
- File uploads use Supabase Storage buckets `boq-uploads`, `tender-docs`, and `compliance-docs`.

Known issues confirmed during audit:

- `package-lock.json` is stale and incompatible with `package.json`, so `npm ci` fails.
- `.env` is committed and contains Supabase project values.
- Supabase Storage migrations create `boq-uploads`, but `tender-docs` and `compliance-docs` are referenced without bucket creation migrations.
- Protected route decisions can happen before profile/role loading completes after auth state changes.
- API/database access is scattered through hooks and pages instead of a clean application service layer.

## Target Architecture

The migrated application keeps the existing React/Vite/TypeScript frontend and professional UI, while introducing a Node/Express API backed by MongoDB/Mongoose.

### Backend

Folder: `server/`

- `server/src/app.js`: Express app wiring.
- `server/src/server.js`: database connection and HTTP startup.
- `server/src/config/env.js`: centralized environment parsing.
- `server/src/config/db.js`: MongoDB connection.
- `server/src/models/`: User, Tender, ComplianceDocument, StoredFile models.
- `server/src/routes/`: auth, tender, compliance, upload/static file routes.
- `server/src/middleware/`: auth, roles, validation, upload, errors.
- `server/src/utils/`: tokens, API responses, async handler helpers.

### Frontend

Keep the existing route/layout/component system. Replace Supabase calls with:

- `src/lib/api/client.ts`: typed fetch client with credentials and consistent errors.
- `src/lib/api/auth.ts`: login/register/profile/logout.
- `src/lib/api/tenders.ts`: tender CRUD, status changes, document uploads/downloads.
- `src/lib/api/compliance.ts`: compliance upload/list/status update/download.
- `src/lib/auth.tsx`: JWT session provider backed by `/api/auth/me`.

## Migration Steps

1. Clean dependency and environment state:
   - Remove tracked `.env`.
   - Add `.env.example` with placeholders for client and server values.
   - Regenerate `package-lock.json`.

2. Implement backend foundation:
   - Express app with security middleware, CORS, JSON body parsing, cookie parsing, static upload serving, and centralized errors.
   - MongoDB connection through Mongoose.
   - JWT auth using httpOnly cookies plus safe JSON session responses.

3. Implement required backend modules:
   - User model and auth routes: register, login, logout, `/me`.
   - Tender model/routes: create, list, read, update, delete, submit, upload documents.
   - Compliance model/routes: upload, list, review/status update.
   - Stored file metadata model and Multer disk upload handling.
   - Validation middleware using Zod.
   - Role middleware for admin/procurement/compliance workflows.

4. Migrate frontend integration:
   - Replace Supabase auth with API-backed auth provider.
   - Replace tender hooks/pages with API calls and `FormData` upload flow.
   - Replace compliance hooks with API calls and backend download URLs.
   - Keep UI components and page structure intact unless small loading/error states are needed.

5. Verification:
   - Run `npm install`.
   - Run `npm run build`.
   - Run `npm run lint`.
   - Run `npm run test`.
   - Fix command failures where feasible and document any remaining external-service requirements.

## Human Production Inputs Required

- MongoDB Atlas or self-hosted MongoDB connection string.
- Strong JWT secret.
- Production frontend/backend domain and CORS origin.
- File storage provider credentials if local disk uploads are replaced with S3, Cloudinary, Azure Blob, or similar.
- Admin user creation or first-user role assignment policy.
- Email/SMS provider credentials if notifications are enabled.
- Supabase data export/import decisions and migration scripts.
- Production deployment configuration.
- Final legal/security review before real client use.

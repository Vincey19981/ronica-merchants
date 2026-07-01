# Ronica Merchants MERN Architecture

## Repository Structure

```text
ronica-merchants/
  client/
    src/components/
    src/hooks/
    src/lib/api/
    src/pages/
  server/
    src/config/
    src/controllers/
    src/middleware/
    src/models/
    src/routes/
    src/serializers/
    src/services/
    src/validators/
    src/utils/
```

The repository is organized as a MERN workspace. The root package only orchestrates workspace scripts and shared install state. Application code lives in `client/` and `server/`.

## Client

The client keeps the polished procurement portal experience:

- Public marketing pages, product discovery, tender services, contact, and quote request flows.
- Authenticated portal routes for dashboard, profile, catalog/cart, tenders, documents, orders, invoices, tickets, assets, and admin pages.
- API access is centralized under `client/src/lib/api/`, keeping backend calls out of page components.
- Authentication state is managed by `client/src/lib/auth.tsx`.
- Protected routes wait for the session, profile, and roles before redirecting.

## Server

The backend is an Express API backed by MongoDB/Mongoose:

- `server/src/app.js`: Express app wiring.
- `server/src/server.js`: database connection and HTTP startup.
- `server/src/config/`: environment and database config.
- `server/src/models/`: User, Tender, ComplianceDocument, StoredFile, and PublicSubmission models.
- `server/src/controllers/`: HTTP handlers for auth, tenders, compliance, and public submissions.
- `server/src/middleware/`: auth, roles, validation, upload, not-found, and error handling.
- `server/src/routes/`: thin endpoint definitions with middleware composition.
- `server/src/serializers/`: response mappers that keep API payloads stable.
- `server/src/services/`: business logic, access checks, file persistence, and database workflows.
- `server/src/validators/`: Zod request schemas shared by route handlers.
- `server/src/utils/`: token, response, error, and async helpers.

## Implemented Backend Modules

- JWT auth with bcrypt password hashing.
- Role-based access control for protected operations.
- Tender create/list/detail/update/status/document-upload routes.
- Compliance document upload/list/review/download routes.
- Public enquiry and quote request submissions.
- Multer-based backend-controlled file uploads.
- Zod validation before writing to MongoDB.
- Consistent JSON API responses and centralized error handling.

## Verification

Run from the repository root:

```bash
npm install
npm run build
npm run lint
npm run test
```

## Production Inputs Required

- MongoDB Atlas or self-hosted MongoDB connection string.
- Strong JWT secret.
- Production frontend/backend domain and CORS origin.
- Cloud file storage credentials if local disk uploads are replaced.
- Admin user creation or invitation policy.
- Email/SMS provider credentials if notifications are enabled.
- Production deployment configuration.
- Final legal and security review before real client use.

# Agent rules
- Public contact form posts directly to the Lovable Cloud enquiries table via REST (client/src/lib/api/contact.ts); the Express API is not running in preview, so public pages must not depend on it.
- Keep root build scripts and TypeScript project references pointed at the client workspace so the publishing pipeline can build from the repository root.

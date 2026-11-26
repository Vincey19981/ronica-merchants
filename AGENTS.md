# Agent rules
- Public contact form posts directly to the Lovable Cloud enquiries table via REST (client/src/lib/api/contact.ts); the Express API is not running in preview, so public pages must not depend on it.
- Keep root TypeScript project references pointed at the client workspace, and delegate root scripts with explicit `bun run --cwd ./client` or `./server` paths; publishing rewrites npm workspace shortcuts into filters that do not match scoped package names.
- Client Vite build writes to the root dist/ because Lovable deploys dist/ from the project root.

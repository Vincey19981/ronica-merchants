Phases 2–5 together are a very large body of work (~40+ files, 6+ migrations, 1 Stripe enable step that requires your input). I'll execute them in this order and ship each phase as a coherent chunk so the app stays usable throughout.

## Phase 2 — Catalog migration & contract pricing
- Migration: seed `public.products` from the 140 entries in `src/data/products.ts` (SKU auto-generated, category mapped, `is_active=true`, public read policy already exists).
- Refactor `src/pages/Products.tsx` to query from `products` table (keep current category landing + search UX intact). Static file kept only for category metadata (theme/blurb).
- `ProductCard`: if user is authenticated and in an org with an active contract, call `resolve_contract_price(product_id, 1)` and show "Your price: KSh X" badge. Otherwise show "Request Quote" as today.
- Portal `/portal/catalog`: authenticated catalog view with contract prices inline, "Add to cart" button (cart = localStorage for now, consumed in Phase 4).

## Phase 3 — Tenders module
- Storage bucket `tender-docs` (private) + RLS on storage.objects scoped by org.
- Client pages:
  - `/portal/tenders` — list org tenders with status badges.
  - `/portal/tenders/new` — create tender (title, description, deadline, line items table, multi-file upload).
  - `/portal/tenders/:id` — detail with status timeline (from `tender_status_history`), documents, items, submit/withdraw actions.
- Admin pages:
  - `/admin/tenders` — all tenders across orgs, filter by status.
  - `/admin/tenders/:id` — advance status (draft → submitted → under_review → awarded/rejected), attach award docs, internal notes. Status changes write to `tender_status_history` + `audit_log`.

## Phase 4 — Orders, Invoices, Stripe
- Stripe: I'll call `payments--recommend_payment_provider` then `payments--enable_stripe_payments`. **You'll need to fill the Stripe form once** (email/business name). I'll pause and wait.
- Cart → checkout flow in `/portal/cart`: convert localStorage cart into an `orders` row + `order_items`, using contract prices via `resolve_contract_price`.
- Admin `/admin/orders`: list, update status (placed → confirmed → packed → shipped → delivered), create shipments.
- Invoice generated automatically when order moves to `confirmed` (edge function `create-invoice`). Client `/portal/invoices` lists invoices with "Pay" button.
- Stripe checkout edge function `create-payment` + webhook `stripe-webhook` to mark invoice paid and insert `payments` row.

## Phase 5 — Tickets, Assets, Compliance, Notifications, Audit, Realtime
- IT Tickets: `/portal/tickets` (create with priority/category, comment thread, SLA countdown). Admin queue at `/admin/tickets` with assign/resolve. Internal comments hidden from clients (already in RLS).
- Assets: `/portal/assets` register (read-only for clients), admin CRUD at `/admin/assets`, link to tickets.
- Compliance: `/portal/documents` upload/view compliance docs (KRA PIN, tax compliance, etc.) with expiry alerts. Bucket `compliance-docs` (private).
- Notifications: bell icon in `PortalLayout` header, dropdown of unread, mark-as-read. Subscribed via Realtime on `notifications` table filtered by `user_id`.
- Audit log: admin-only `/admin/audit` viewer with filters (actor, action, entity, date).
- Realtime: enable on `tenders`, `orders`, `invoices`, `it_tickets`, `notifications` and add subscriptions to the relevant pages so admin/client see updates without refresh.

## Out of scope (will note as TODO)
- SAML wiring (data model is ready, no IdP yet).
- Email notifications (in-app only for now).
- PDF invoice rendering (Stripe-hosted invoice link used instead).
- Fine-grained admin permissions beyond the existing `admin` role.

## How I'll deliver
I'll ship Phase 2 first, then Phase 3, then pause at Phase 4 for the Stripe enable step, then finish 4 and 5. Each phase ends in a working build.

Approve and I'll start with Phase 2.
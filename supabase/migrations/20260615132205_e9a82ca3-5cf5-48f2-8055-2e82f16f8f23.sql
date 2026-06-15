
-- ---------- updated_at helper ----------
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tax_id text,
  industry text,
  billing_address jsonb,
  shipping_address jsonb,
  contact_email text,
  contact_phone text,
  credit_limit_cents bigint NOT NULL DEFAULT 0,
  payment_terms_days int NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_organizations_updated ON public.organizations;
CREATE TRIGGER tg_organizations_updated BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  full_name text,
  email text,
  phone text,
  job_title text,
  avatar_url text,
  idp_provider text,
  idp_subject text,
  mfa_enrolled boolean NOT NULL DEFAULT false,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_profiles_updated ON public.profiles;
CREATE TRIGGER tg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid()
$$;
REVOKE EXECUTE ON FUNCTION public.current_org_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_org_id() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin') OR org_id = public.current_org_id());
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "orgs_select" ON public.organizations;
CREATE POLICY "orgs_select" ON public.organizations FOR SELECT TO authenticated
  USING (id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "orgs_admin_all" ON public.organizations;
CREATE POLICY "orgs_admin_all" ON public.organizations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  subcategory text,
  uom text NOT NULL DEFAULT 'each',
  manufacturer text,
  image_url text,
  list_price_cents bigint,
  stock_qty int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  search_tsv tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_search_idx ON public.products USING gin(search_tsv);
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_products_updated ON public.products;
CREATE TRIGGER tg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE OR REPLACE FUNCTION public.tg_products_search()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_tsv := to_tsvector('simple',
    coalesce(NEW.sku,'')||' '||coalesce(NEW.name,'')||' '||coalesce(NEW.category,'')||' '||
    coalesce(NEW.subcategory,'')||' '||coalesce(NEW.manufacturer,'')||' '||coalesce(NEW.description,''));
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS tg_products_tsv ON public.products;
CREATE TRIGGER tg_products_tsv BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_products_search();

DROP POLICY IF EXISTS "products_read" ON public.products;
CREATE POLICY "products_read" ON public.products FOR SELECT TO authenticated
  USING (active = true OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "products_admin_all" ON public.products;
CREATE POLICY "products_admin_all" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- CONTRACTS & PRICING
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  reference text UNIQUE NOT NULL,
  title text NOT NULL,
  framework text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contracts_org_idx ON public.contracts(org_id);
GRANT SELECT ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_contracts_updated ON public.contracts;
CREATE TRIGGER tg_contracts_updated BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP POLICY IF EXISTS "contracts_org_read" ON public.contracts;
CREATE POLICY "contracts_org_read" ON public.contracts FOR SELECT TO authenticated
  USING (org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "contracts_admin_all" ON public.contracts;
CREATE POLICY "contracts_admin_all" ON public.contracts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.contract_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  unit_price_cents bigint NOT NULL,
  min_qty int NOT NULL DEFAULT 1,
  max_qty int,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(contract_id, product_id, min_qty)
);
CREATE INDEX IF NOT EXISTS cp_contract_idx ON public.contract_pricing(contract_id);
GRANT SELECT ON public.contract_pricing TO authenticated;
GRANT ALL ON public.contract_pricing TO service_role;
ALTER TABLE public.contract_pricing ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cp_org_read" ON public.contract_pricing;
CREATE POLICY "cp_org_read" ON public.contract_pricing FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.contracts c WHERE c.id = contract_id
          AND (c.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin')))
);
DROP POLICY IF EXISTS "cp_admin_all" ON public.contract_pricing;
CREATE POLICY "cp_admin_all" ON public.contract_pricing FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- TENDERS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.tender_status AS ENUM
    ('draft','submitted','under_review','clarification_requested','awarded','declined','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  reference text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  buyer_name text,
  submission_deadline timestamptz,
  status public.tender_status NOT NULL DEFAULT 'draft',
  value_cents bigint,
  awarded_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tenders_org_idx ON public.tenders(org_id);
CREATE INDEX IF NOT EXISTS tenders_status_idx ON public.tenders(status);
GRANT SELECT, INSERT, UPDATE ON public.tenders TO authenticated;
GRANT ALL ON public.tenders TO service_role;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_tenders_updated ON public.tenders;
CREATE TRIGGER tg_tenders_updated BEFORE UPDATE ON public.tenders
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP POLICY IF EXISTS "tenders_org_read" ON public.tenders;
CREATE POLICY "tenders_org_read" ON public.tenders FOR SELECT TO authenticated
  USING (org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "tenders_proc_insert" ON public.tenders;
CREATE POLICY "tenders_proc_insert" ON public.tenders FOR INSERT TO authenticated
  WITH CHECK (org_id = public.current_org_id() AND public.has_role(auth.uid(),'procurement_officer'));
DROP POLICY IF EXISTS "tenders_proc_update" ON public.tenders;
CREATE POLICY "tenders_proc_update" ON public.tenders FOR UPDATE TO authenticated
  USING (org_id = public.current_org_id() AND public.has_role(auth.uid(),'procurement_officer'))
  WITH CHECK (org_id = public.current_org_id());
DROP POLICY IF EXISTS "tenders_admin_all" ON public.tenders;
CREATE POLICY "tenders_admin_all" ON public.tenders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.tender_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  description text NOT NULL,
  qty numeric NOT NULL,
  uom text NOT NULL DEFAULT 'each',
  unit_price_cents bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tender_items_tender_idx ON public.tender_items(tender_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tender_items TO authenticated;
GRANT ALL ON public.tender_items TO service_role;
ALTER TABLE public.tender_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tender_items_all" ON public.tender_items;
CREATE POLICY "tender_items_all" ON public.tender_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenders t WHERE t.id = tender_id
         AND (t.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tenders t WHERE t.id = tender_id
              AND (t.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE IF NOT EXISTS public.tender_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  size_bytes bigint,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.tender_documents TO authenticated;
GRANT ALL ON public.tender_documents TO service_role;
ALTER TABLE public.tender_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tender_docs_all" ON public.tender_documents;
CREATE POLICY "tender_docs_all" ON public.tender_documents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenders t WHERE t.id = tender_id
         AND (t.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tenders t WHERE t.id = tender_id
              AND (t.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE IF NOT EXISTS public.tender_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  from_status public.tender_status,
  to_status public.tender_status NOT NULL,
  note text,
  changed_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tender_status_history TO authenticated;
GRANT ALL ON public.tender_status_history TO service_role;
ALTER TABLE public.tender_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tender_hist_read" ON public.tender_status_history;
CREATE POLICY "tender_hist_read" ON public.tender_status_history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenders t WHERE t.id = tender_id
         AND (t.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));
DROP POLICY IF EXISTS "tender_hist_admin_insert" ON public.tender_status_history;
CREATE POLICY "tender_hist_admin_insert" ON public.tender_status_history FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- ORDERS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM
    ('draft','submitted','confirmed','picking','packed','shipped','in_transit','delivered','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contract_id uuid REFERENCES public.contracts(id),
  order_number text UNIQUE NOT NULL,
  po_number text,
  status public.order_status NOT NULL DEFAULT 'draft',
  subtotal_cents bigint NOT NULL DEFAULT 0,
  tax_cents bigint NOT NULL DEFAULT 0,
  total_cents bigint NOT NULL DEFAULT 0,
  shipping_address jsonb,
  requested_delivery_date date,
  notes text,
  placed_by uuid REFERENCES auth.users(id),
  placed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_org_idx ON public.orders(org_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_orders_updated ON public.orders;
CREATE TRIGGER tg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP POLICY IF EXISTS "orders_org_read" ON public.orders;
CREATE POLICY "orders_org_read" ON public.orders FOR SELECT TO authenticated
  USING (org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "orders_proc_insert" ON public.orders;
CREATE POLICY "orders_proc_insert" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (org_id = public.current_org_id() AND public.has_role(auth.uid(),'procurement_officer'));
DROP POLICY IF EXISTS "orders_proc_update" ON public.orders;
CREATE POLICY "orders_proc_update" ON public.orders FOR UPDATE TO authenticated
  USING (org_id = public.current_org_id() AND public.has_role(auth.uid(),'procurement_officer'))
  WITH CHECK (org_id = public.current_org_id());
DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_all" ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  description text NOT NULL,
  qty numeric NOT NULL,
  uom text NOT NULL DEFAULT 'each',
  unit_price_cents bigint NOT NULL,
  line_total_cents bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items(order_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_items_all" ON public.order_items;
CREATE POLICY "order_items_all" ON public.order_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
         AND (o.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
              AND (o.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  tracking_number text,
  carrier text,
  status text NOT NULL DEFAULT 'pending',
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shipments_read" ON public.shipments;
CREATE POLICY "shipments_read" ON public.shipments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
         AND (o.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));
DROP POLICY IF EXISTS "shipments_admin_all" ON public.shipments;
CREATE POLICY "shipments_admin_all" ON public.shipments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- INVOICES & PAYMENTS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.invoice_status AS ENUM ('draft','issued','partially_paid','paid','overdue','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  invoice_number text UNIQUE NOT NULL,
  status public.invoice_status NOT NULL DEFAULT 'draft',
  issued_at date,
  due_at date,
  subtotal_cents bigint NOT NULL DEFAULT 0,
  tax_cents bigint NOT NULL DEFAULT 0,
  total_cents bigint NOT NULL DEFAULT 0,
  balance_cents bigint NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invoices_org_idx ON public.invoices(org_id);
GRANT SELECT ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_invoices_updated ON public.invoices;
CREATE TRIGGER tg_invoices_updated BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
DROP POLICY IF EXISTS "invoices_org_read" ON public.invoices;
CREATE POLICY "invoices_org_read" ON public.invoices FOR SELECT TO authenticated
  USING (org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "invoices_admin_all" ON public.invoices;
CREATE POLICY "invoices_admin_all" ON public.invoices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  qty numeric NOT NULL,
  unit_price_cents bigint NOT NULL,
  line_total_cents bigint NOT NULL
);
GRANT SELECT ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inv_items_read" ON public.invoice_items;
CREATE POLICY "inv_items_read" ON public.invoice_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id
         AND (i.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount_cents bigint NOT NULL,
  method text NOT NULL,
  reference text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payments_read" ON public.payments;
CREATE POLICY "payments_read" ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id
         AND (i.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));

-- ============================================================
-- IT TICKETS, COMMENTS, ASSETS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.ticket_priority AS ENUM ('low','medium','high','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.ticket_status AS ENUM ('open','in_progress','waiting_client','resolved','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.it_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  ticket_number text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  status public.ticket_status NOT NULL DEFAULT 'open',
  reporter_id uuid REFERENCES auth.users(id),
  assignee_id uuid REFERENCES auth.users(id),
  response_due_at timestamptz,
  resolution_due_at timestamptz,
  first_response_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tickets_org_idx ON public.it_tickets(org_id);
GRANT SELECT, INSERT, UPDATE ON public.it_tickets TO authenticated;
GRANT ALL ON public.it_tickets TO service_role;
ALTER TABLE public.it_tickets ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_tickets_updated ON public.it_tickets;
CREATE TRIGGER tg_tickets_updated BEFORE UPDATE ON public.it_tickets
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
DROP POLICY IF EXISTS "tickets_org_read" ON public.it_tickets;
CREATE POLICY "tickets_org_read" ON public.it_tickets FOR SELECT TO authenticated
  USING (org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "tickets_org_insert" ON public.it_tickets;
CREATE POLICY "tickets_org_insert" ON public.it_tickets FOR INSERT TO authenticated
  WITH CHECK (org_id = public.current_org_id());
DROP POLICY IF EXISTS "tickets_admin_all" ON public.it_tickets;
CREATE POLICY "tickets_admin_all" ON public.it_tickets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.it_tickets(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id),
  body text NOT NULL,
  internal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ticket_comments TO authenticated;
GRANT ALL ON public.ticket_comments TO service_role;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tcomments_read" ON public.ticket_comments;
CREATE POLICY "tcomments_read" ON public.ticket_comments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.it_tickets t WHERE t.id = ticket_id
         AND (t.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin')))
    AND (internal = false OR public.has_role(auth.uid(),'admin')));
DROP POLICY IF EXISTS "tcomments_insert" ON public.ticket_comments;
CREATE POLICY "tcomments_insert" ON public.ticket_comments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.it_tickets t WHERE t.id = ticket_id
              AND (t.org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  asset_tag text UNIQUE NOT NULL,
  serial text,
  model text,
  manufacturer text,
  type text,
  status text NOT NULL DEFAULT 'active',
  assigned_to text,
  location text,
  warranty_end date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS assets_org_idx ON public.assets(org_id);
GRANT SELECT ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_assets_updated ON public.assets;
CREATE TRIGGER tg_assets_updated BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
DROP POLICY IF EXISTS "assets_read" ON public.assets;
CREATE POLICY "assets_read" ON public.assets FOR SELECT TO authenticated
  USING (org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "assets_admin_all" ON public.assets;
CREATE POLICY "assets_admin_all" ON public.assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- COMPLIANCE DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.compliance_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  title text NOT NULL,
  storage_path text NOT NULL,
  issued_at date,
  expires_at date,
  status text NOT NULL DEFAULT 'valid',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS compliance_org_idx ON public.compliance_documents(org_id);
CREATE INDEX IF NOT EXISTS compliance_expires_idx ON public.compliance_documents(expires_at);
GRANT SELECT ON public.compliance_documents TO authenticated;
GRANT ALL ON public.compliance_documents TO service_role;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS tg_compliance_updated ON public.compliance_documents;
CREATE TRIGGER tg_compliance_updated BEFORE UPDATE ON public.compliance_documents
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
DROP POLICY IF EXISTS "compliance_read" ON public.compliance_documents;
CREATE POLICY "compliance_read" ON public.compliance_documents FOR SELECT TO authenticated
  USING (org_id IS NULL OR org_id = public.current_org_id() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "compliance_admin_all" ON public.compliance_documents;
CREATE POLICY "compliance_admin_all" ON public.compliance_documents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notif_user_idx ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notif_read_own" ON public.notifications;
CREATE POLICY "notif_read_own" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS "notif_update_own" ON public.notifications;
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  before jsonb,
  after jsonb,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_resource_idx ON public.audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS audit_actor_idx ON public.audit_log(actor_id, created_at DESC);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_admin_read" ON public.audit_log;
CREATE POLICY "audit_admin_read" ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- CONTRACT PRICE RESOLVER
-- ============================================================
CREATE OR REPLACE FUNCTION public.resolve_contract_price(_product_id uuid, _qty int DEFAULT 1)
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT cp.unit_price_cents
  FROM public.contract_pricing cp
  JOIN public.contracts c ON c.id = cp.contract_id
  WHERE cp.product_id = _product_id
    AND c.org_id = public.current_org_id()
    AND c.status = 'active'
    AND CURRENT_DATE BETWEEN c.start_date AND c.end_date
    AND _qty >= cp.min_qty
    AND (cp.max_qty IS NULL OR _qty <= cp.max_qty)
  ORDER BY cp.min_qty DESC
  LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.resolve_contract_price(uuid, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.resolve_contract_price(uuid, int) TO authenticated, service_role;


-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Enquiries table
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  enquiry_type TEXT NOT NULL,
  products_needed TEXT NOT NULL,
  source TEXT,
  attachment_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT name_len CHECK (char_length(name) BETWEEN 1 AND 120),
  CONSTRAINT org_len CHECK (char_length(organization) BETWEEN 1 AND 200),
  CONSTRAINT email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT phone_len CHECK (char_length(phone) BETWEEN 5 AND 40),
  CONSTRAINT etype_vals CHECK (enquiry_type IN ('General Quotation','Tender/BOQ','LPO Supply','Bulk Order','Other')),
  CONSTRAINT products_len CHECK (char_length(products_needed) BETWEEN 1 AND 5000),
  CONSTRAINT source_len CHECK (source IS NULL OR char_length(source) <= 80)
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
ON public.enquiries FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view enquiries"
ON public.enquiries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete enquiries"
ON public.enquiries FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for BOQ uploads (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('boq-uploads', 'boq-uploads', false);

CREATE POLICY "Anyone can upload BOQs"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'boq-uploads');

CREATE POLICY "Admins can read BOQs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'boq-uploads' AND public.has_role(auth.uid(), 'admin'));


CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS public.ticket_number_seq START 1000;

CREATE OR REPLACE FUNCTION public.next_order_number()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'ORD-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 5, '0')
$$;
CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'INV-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0')
$$;
CREATE OR REPLACE FUNCTION public.next_ticket_number()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'TKT-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.ticket_number_seq')::text, 5, '0')
$$;
GRANT EXECUTE ON FUNCTION public.next_order_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.next_ticket_number() TO authenticated;

CREATE OR REPLACE FUNCTION public.log_audit(
  _action text, _resource_type text, _resource_id uuid,
  _before jsonb DEFAULT NULL, _after jsonb DEFAULT NULL
) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.audit_log(actor_id, action, resource_type, resource_id, before, after)
  VALUES (auth.uid(), _action, _resource_type, _resource_id, _before, _after);
$$;
GRANT EXECUTE ON FUNCTION public.log_audit(text,text,uuid,jsonb,jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.notify_user(
  _user_id uuid, _type text, _title text, _body text DEFAULT NULL, _link text DEFAULT NULL
) RETURNS uuid LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.notifications(user_id, type, title, body, link)
  VALUES (_user_id, _type, _title, _body, _link)
  RETURNING id;
$$;
GRANT EXECUTE ON FUNCTION public.notify_user(uuid,text,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_invoice_from_order(_order_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _invoice_id uuid; _org_id uuid; _subtotal bigint; _placed_by uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can issue invoices';
  END IF;
  SELECT org_id, subtotal_cents, placed_by INTO _org_id, _subtotal, _placed_by
  FROM public.orders WHERE id = _order_id;
  IF _org_id IS NULL THEN RAISE EXCEPTION 'Order not found'; END IF;

  INSERT INTO public.invoices(org_id, order_id, invoice_number, status, issued_at, due_at,
                              subtotal_cents, tax_cents, total_cents, balance_cents)
  VALUES (_org_id, _order_id, public.next_invoice_number(), 'issued', CURRENT_DATE, CURRENT_DATE + 30,
          _subtotal, 0, _subtotal, _subtotal)
  RETURNING id INTO _invoice_id;

  INSERT INTO public.invoice_items(invoice_id, description, qty, unit_price_cents, line_total_cents)
  SELECT _invoice_id, description, qty, unit_price_cents, line_total_cents
  FROM public.order_items WHERE order_id = _order_id;

  PERFORM public.log_audit('invoice.created','invoice',_invoice_id,NULL,
    jsonb_build_object('order_id',_order_id,'total_cents',_subtotal));

  IF _placed_by IS NOT NULL THEN
    PERFORM public.notify_user(_placed_by,'invoice','New invoice issued',
      'An invoice has been issued for your order.', '/portal/invoices/' || _invoice_id);
  END IF;
  RETURN _invoice_id;
END $$;
GRANT EXECUTE ON FUNCTION public.create_invoice_from_order(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.record_payment(
  _invoice_id uuid, _amount_cents bigint, _method text, _reference text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _pid uuid; _new_balance bigint; _total bigint;
BEGIN
  IF NOT (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'finance')) THEN
    RAISE EXCEPTION 'Not permitted';
  END IF;
  INSERT INTO public.payments(invoice_id, amount_cents, method, reference)
  VALUES (_invoice_id, _amount_cents, _method, _reference) RETURNING id INTO _pid;

  SELECT total_cents, balance_cents - _amount_cents INTO _total, _new_balance
  FROM public.invoices WHERE id = _invoice_id;

  UPDATE public.invoices
  SET balance_cents = GREATEST(_new_balance, 0),
      status = CASE WHEN _new_balance <= 0 THEN 'paid'::invoice_status
                    WHEN _new_balance < _total THEN 'partially_paid'::invoice_status
                    ELSE status END
  WHERE id = _invoice_id;

  PERFORM public.log_audit('payment.recorded','invoice',_invoice_id,NULL,
    jsonb_build_object('amount_cents',_amount_cents,'method',_method));
  RETURN _pid;
END $$;
GRANT EXECUTE ON FUNCTION public.record_payment(uuid,bigint,text,text) TO authenticated;

CREATE POLICY "compliance_org_insert" ON public.compliance_documents
  FOR INSERT TO authenticated
  WITH CHECK (org_id = public.current_org_id() AND
    (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'compliance')
     OR public.has_role(auth.uid(),'procurement_officer')));

CREATE POLICY "compliance_org_update" ON public.compliance_documents
  FOR UPDATE TO authenticated
  USING (org_id = public.current_org_id() AND
    (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'compliance')))
  WITH CHECK (org_id = public.current_org_id());

CREATE POLICY "compliance_org_delete" ON public.compliance_documents
  FOR DELETE TO authenticated
  USING (org_id = public.current_org_id() AND
    (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'compliance')));

CREATE POLICY "compliance_storage_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'compliance-docs' AND (
    (storage.foldername(name))[1] = public.current_org_id()::text
    OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "compliance_storage_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'compliance-docs' AND
    (storage.foldername(name))[1] = public.current_org_id()::text);

CREATE POLICY "compliance_storage_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'compliance-docs' AND
    (storage.foldername(name))[1] = public.current_org_id()::text
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'compliance')));

DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='orders';
  IF NOT FOUND THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.orders; END IF;
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='invoices';
  IF NOT FOUND THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices; END IF;
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='it_tickets';
  IF NOT FOUND THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.it_tickets; END IF;
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='ticket_comments';
  IF NOT FOUND THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_comments; END IF;
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='notifications';
  IF NOT FOUND THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications; END IF;
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='tenders';
  IF NOT FOUND THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.tenders; END IF;
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='tender_status_history';
  IF NOT FOUND THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.tender_status_history; END IF;
END $$;

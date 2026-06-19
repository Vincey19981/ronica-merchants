
REVOKE EXECUTE ON FUNCTION public.next_order_number() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.next_invoice_number() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.next_ticket_number() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_audit(text,text,uuid,jsonb,jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_user(uuid,text,text,text,text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_invoice_from_order(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_payment(uuid,bigint,text,text) FROM PUBLIC;

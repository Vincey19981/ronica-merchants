
-- Storage RLS for tender-docs (path: <org_id>/<tender_id>/<filename>)
CREATE POLICY "tender_docs_read"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'tender-docs' AND (
    public.has_role(auth.uid(), 'admin') OR
    (storage.foldername(name))[1] = public.current_org_id()::text
  )
);

CREATE POLICY "tender_docs_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'tender-docs' AND (
    public.has_role(auth.uid(), 'admin') OR
    (storage.foldername(name))[1] = public.current_org_id()::text
  )
);

CREATE POLICY "tender_docs_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'tender-docs' AND (
    public.has_role(auth.uid(), 'admin') OR
    (storage.foldername(name))[1] = public.current_org_id()::text
  )
);

-- Allow procurement officers to log status history for their own org's tenders (e.g. on submit)
CREATE POLICY "tender_hist_proc_insert"
ON public.tender_status_history FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tenders t
    WHERE t.id = tender_status_history.tender_id
      AND t.org_id = public.current_org_id()
      AND public.has_role(auth.uid(), 'procurement_officer')
  )
);

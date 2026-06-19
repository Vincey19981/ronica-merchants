import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const useComplianceDocs = () =>
  useQuery({
    queryKey: ["compliance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_documents").select("*").order("expires_at", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const useUploadCompliance = () => {
  const { profile } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { file: File; doc_type: string; title: string; issued_at?: string; expires_at?: string }) => {
      if (!profile?.org_id) throw new Error("No organization");
      const path = `${profile.org_id}/${Date.now()}-${args.file.name}`;
      const { error: upErr } = await supabase.storage.from("compliance-docs").upload(path, args.file);
      if (upErr) throw upErr;
      const { error } = await supabase.from("compliance_documents").insert({
        org_id: profile.org_id, doc_type: args.doc_type, title: args.title, storage_path: path,
        issued_at: args.issued_at || null, expires_at: args.expires_at || null,
        status: args.expires_at && new Date(args.expires_at) < new Date() ? "expired" : "valid",
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compliance"] }),
  });
};

export const getComplianceSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage.from("compliance-docs").createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
};
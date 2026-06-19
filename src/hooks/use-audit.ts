import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuditLog = (filters?: { resource_type?: string; action?: string }) =>
  useQuery({
    queryKey: ["audit", filters ?? {}],
    queryFn: async () => {
      let q = supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200);
      if (filters?.resource_type) q = q.eq("resource_type", filters.resource_type);
      if (filters?.action) q = q.ilike("action", `%${filters.action}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
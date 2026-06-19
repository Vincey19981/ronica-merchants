import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { Database } from "@/integrations/supabase/types";

export type TicketStatus = Database["public"]["Enums"]["ticket_status"];
export type TicketPriority = Database["public"]["Enums"]["ticket_priority"];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open", in_progress: "In progress", waiting_client: "Waiting on client",
  resolved: "Resolved", closed: "Closed",
};
export const TICKET_STATUS_VARIANT: Record<TicketStatus, string> = {
  open: "bg-blue-500/10 text-blue-700",
  in_progress: "bg-amber-500/10 text-amber-700",
  waiting_client: "bg-purple-500/10 text-purple-700",
  resolved: "bg-emerald-500/10 text-emerald-700",
  closed: "bg-muted text-muted-foreground",
};
export const TICKET_PRIORITY_VARIANT: Record<TicketPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/10 text-blue-700",
  high: "bg-amber-500/10 text-amber-700",
  critical: "bg-destructive/10 text-destructive",
};

export const useTickets = () =>
  useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("it_tickets").select("*, organizations(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const useTicket = (id: string | undefined) => {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["ticket", id],
    enabled: !!id,
    queryFn: async () => {
      const [t, c] = await Promise.all([
        supabase.from("it_tickets").select("*, organizations(name)").eq("id", id!).maybeSingle(),
        supabase.from("ticket_comments").select("*").eq("ticket_id", id!).order("created_at"),
      ]);
      if (t.error) throw t.error;
      return { ticket: t.data, comments: c.data ?? [] };
    },
  });

  useEffect(() => {
    if (!id) return;
    const ch = supabase
      .channel(`ticket-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "ticket_comments", filter: `ticket_id=eq.${id}` },
        () => qc.invalidateQueries({ queryKey: ["ticket", id] }))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "it_tickets", filter: `id=eq.${id}` },
        () => qc.invalidateQueries({ queryKey: ["ticket", id] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, qc]);

  return query;
};

export const useCreateTicket = () => {
  const { profile } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { title: string; description: string; category: string; priority: TicketPriority }) => {
      if (!profile?.org_id) throw new Error("No organization linked");
      const { data: num, error: nErr } = await supabase.rpc("next_ticket_number");
      if (nErr) throw nErr;
      const { data, error } = await supabase.from("it_tickets").insert({
        org_id: profile.org_id, ticket_number: num as string,
        title: args.title, description: args.description, category: args.category,
        priority: args.priority, status: "open", reporter_id: profile.id,
        response_due_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        resolution_due_at: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      }).select().single();
      if (error) throw error;
      await supabase.rpc("log_audit", {
        _action: "ticket.created", _resource_type: "ticket", _resource_id: data.id,
        _before: null, _after: { priority: args.priority },
      });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      return data;
    },
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<{ status: TicketStatus; priority: TicketPriority; assignee_id: string | null }> }) => {
      const update: any = { ...patch };
      if (patch.status === "resolved") update.resolved_at = new Date().toISOString();
      const { error } = await supabase.from("it_tickets").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["ticket", v.id] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useAddComment = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (args: { ticket_id: string; body: string; internal?: boolean }) => {
      const { error } = await supabase.from("ticket_comments").insert({
        ticket_id: args.ticket_id, body: args.body, internal: !!args.internal, author_id: user?.id ?? null,
      });
      if (error) throw error;
    },
  });
};
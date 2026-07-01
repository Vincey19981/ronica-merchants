import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TicketStatus = "open" | "in_progress" | "waiting_client" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_client: "Waiting on client",
  resolved: "Resolved",
  closed: "Closed",
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
    queryFn: async () => [],
  });

export const useTicket = (id: string | undefined) =>
  useQuery({
    queryKey: ["ticket", id],
    enabled: !!id,
    queryFn: async () => ({ ticket: null, comments: [] }),
  });

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { title: string; description: string; category: string; priority: TicketPriority }) => {
      throw new Error("Ticket creation needs the next MERN backend module before production use.");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { id: string; patch: Partial<{ status: TicketStatus; priority: TicketPriority; assignee_id: string | null }> }) =>
      undefined,
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["ticket", v.id] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useAddComment = () =>
  useMutation({
    mutationFn: async (_args: { ticket_id: string; body: string; internal?: boolean }) => undefined,
  });

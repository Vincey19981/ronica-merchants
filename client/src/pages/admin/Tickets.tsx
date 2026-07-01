import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTickets, useUpdateTicket, TICKET_STATUS_LABELS, TICKET_STATUS_VARIANT, TICKET_PRIORITY_VARIANT, type TicketStatus } from "@/hooks/use-tickets";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminTickets = () => {
  const { data = [], isLoading } = useTickets();
  const update = useUpdateTicket();
  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin · IT Tickets</h1>
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-3 py-3 text-left">Ticket</th><th className="px-3 py-3 text-left">Org</th>
            <th className="px-3 py-3 text-left">Title</th><th className="px-3 py-3 text-left">Priority</th>
            <th className="px-3 py-3 text-left">Status</th>
          </tr></thead>
          <tbody>
            {data.map((t: any) => (
              <tr key={t.id} className="border-t">
                <td className="px-3 py-3 font-mono text-xs"><Link to={`/portal/tickets/${t.id}`} className="text-primary hover:underline">{t.ticket_number}</Link></td>
                <td className="px-3 py-3">{t.organizations?.name ?? "—"}</td>
                <td className="px-3 py-3">{t.title}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${TICKET_PRIORITY_VARIANT[t.priority]}`}>{t.priority}</span></td>
                <td className="px-3 py-3">
                  <Select value={t.status} onValueChange={(v) => update.mutate({ id: t.id, patch: { status: v as TicketStatus } })}>
                    <SelectTrigger className={`h-8 w-44 ${TICKET_STATUS_VARIANT[t.status]}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(TICKET_STATUS_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminTickets;
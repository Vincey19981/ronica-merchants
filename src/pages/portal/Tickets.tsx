import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTickets, TICKET_STATUS_LABELS, TICKET_STATUS_VARIANT, TICKET_PRIORITY_VARIANT } from "@/hooks/use-tickets";

const Tickets = () => {
  const { data = [], isLoading } = useTickets();
  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">IT Tickets</h1>
        <Button asChild variant="gold"><Link to="/portal/tickets/new"><Plus className="mr-2 h-4 w-4" /> New ticket</Link></Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">Ticket</th><th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Priority</th><th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Created</th>
          </tr></thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No tickets yet.</td></tr>}
            {data.map((t: any) => (
              <tr key={t.id} className="border-t hover:bg-muted/40">
                <td className="px-4 py-3 font-mono text-xs"><Link to={`/portal/tickets/${t.id}`} className="text-primary hover:underline">{t.ticket_number}</Link></td>
                <td className="px-4 py-3">{t.title}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TICKET_PRIORITY_VARIANT[t.priority]}`}>{t.priority}</span></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TICKET_STATUS_VARIANT[t.status]}`}>{TICKET_STATUS_LABELS[t.status]}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Tickets;
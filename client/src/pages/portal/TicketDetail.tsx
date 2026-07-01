import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useTicket, useAddComment, useUpdateTicket,
  TICKET_STATUS_LABELS, TICKET_STATUS_VARIANT, TICKET_PRIORITY_VARIANT, type TicketStatus,
} from "@/hooks/use-tickets";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const TicketDetail = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useTicket(id);
  const addComment = useAddComment();
  const update = useUpdateTicket();
  const { isAdmin } = useAuth();
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);

  if (isLoading || !data?.ticket) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  const t: any = data.ticket;

  const post = async () => {
    if (!body.trim() || !id) return;
    try {
      await addComment.mutateAsync({ ticket_id: id, body, internal: isAdmin && internal });
      setBody(""); setInternal(false); refetch();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/portal/tickets" className="text-sm text-muted-foreground hover:underline">← Tickets</Link>
          <h1 className="text-2xl font-bold">{t.ticket_number} · {t.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TICKET_PRIORITY_VARIANT[t.priority]}`}>{t.priority}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TICKET_STATUS_VARIANT[t.status]}`}>{TICKET_STATUS_LABELS[t.status]}</span>
        </div>
      </div>

      {t.description && <div className="rounded-lg border bg-card p-4 text-sm whitespace-pre-wrap">{t.description}</div>}

      {isAdmin && (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <Label>Status:</Label>
          <Select value={t.status} onValueChange={(v) => update.mutate({ id: t.id, patch: { status: v as TicketStatus } })}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TICKET_STATUS_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-semibold">Conversation</h2>
        {data.comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
        {data.comments.map((c: any) => (
          <div key={c.id} className={`rounded-lg border p-3 text-sm ${c.internal ? "border-amber-300 bg-amber-50" : "bg-card"}`}>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{c.internal ? "Internal note" : "Reply"}</span>
              <span>{new Date(c.created_at).toLocaleString()}</span>
            </div>
            <p className="whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}

        <div className="space-y-2 rounded-lg border bg-card p-4">
          <Textarea rows={3} placeholder="Add a reply…" value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="flex items-center justify-between">
            {isAdmin ? (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={internal} onCheckedChange={(v) => setInternal(!!v)} />
                Internal note (hidden from client)
              </label>
            ) : <span />}
            <Button onClick={post} disabled={!body.trim() || addComment.isPending}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TicketDetail;
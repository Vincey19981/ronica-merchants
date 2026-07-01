import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTicket, type TicketPriority } from "@/hooks/use-tickets";
import { toast } from "@/hooks/use-toast";

const TicketNew = () => {
  const create = useCreateTicket();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("hardware");
  const [priority, setPriority] = useState<TicketPriority>("medium");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const t = await create.mutateAsync({ title, description, category, priority });
      toast({ title: "Ticket created", description: (t as any).ticket_number });
      nav(`/portal/tickets/${(t as any).id}`);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Link to="/portal/tickets" className="text-sm text-muted-foreground hover:underline">← Tickets</Link>
      <h1 className="text-2xl font-bold">New IT ticket</h1>
      <form onSubmit={submit} className="space-y-4 rounded-lg border bg-card p-6">
        <div className="space-y-1"><Label>Title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="space-y-1"><Label>Description</Label><Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1"><Label>Category</Label>
            <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="account">Account / Access</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" variant="gold" disabled={create.isPending}>
          {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit ticket
        </Button>
      </form>
    </div>
  );
};
export default TicketNew;
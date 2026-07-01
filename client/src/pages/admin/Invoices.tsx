import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvoices, useRecordPayment, INVOICE_STATUS_LABELS, INVOICE_STATUS_VARIANT } from "@/hooks/use-invoices";
import { formatPrice } from "@/hooks/use-products";
import { toast } from "@/hooks/use-toast";

const PayDialog = ({ invoice }: { invoice: any }) => {
  const record = useRecordPayment();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState((invoice.balance_cents / 100).toString());
  const [method, setMethod] = useState("mpesa");
  const [reference, setReference] = useState("");

  const submit = async () => {
    try {
      await record.mutateAsync({
        invoice_id: invoice.id,
        amount_cents: Math.round(parseFloat(amount) * 100),
        method, reference,
      });
      toast({ title: "Payment recorded" });
      setOpen(false);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline" disabled={invoice.balance_cents <= 0}>Record payment</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Record payment · {invoice.invoice_number}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1"><Label>Amount (KSh)</Label><Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div className="space-y-1"><Label>Method</Label>
            <Select value={method} onValueChange={setMethod}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="bank_transfer">Bank transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Reference</Label><Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Transaction code / cheque #" /></div>
          <Button onClick={submit} variant="gold" className="w-full" disabled={record.isPending}>
            {record.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AdminInvoices = () => {
  const { data = [], isLoading } = useInvoices();
  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin · Invoices</h1>
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-3 py-3 text-left">Invoice</th><th className="px-3 py-3 text-left">Org</th>
            <th className="px-3 py-3 text-left">Status</th><th className="px-3 py-3 text-right">Total</th>
            <th className="px-3 py-3 text-right">Balance</th><th className="px-3 py-3"></th>
          </tr></thead>
          <tbody>
            {data.map((i: any) => (
              <tr key={i.id} className="border-t">
                <td className="px-3 py-3"><Link to={`/portal/invoices/${i.id}`} className="font-medium text-primary hover:underline">{i.invoice_number}</Link></td>
                <td className="px-3 py-3">{i.organizations?.name ?? "—"}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${INVOICE_STATUS_VARIANT[i.status]}`}>{INVOICE_STATUS_LABELS[i.status]}</span></td>
                <td className="px-3 py-3 text-right">{formatPrice(i.total_cents)}</td>
                <td className="px-3 py-3 text-right font-semibold">{formatPrice(i.balance_cents)}</td>
                <td className="px-3 py-3 text-right"><PayDialog invoice={i} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminInvoices;
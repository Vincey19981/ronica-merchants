import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useInvoices, INVOICE_STATUS_LABELS, INVOICE_STATUS_VARIANT } from "@/hooks/use-invoices";
import { formatPrice } from "@/hooks/use-products";

const Invoices = () => {
  const { data = [], isLoading } = useInvoices();
  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Invoices</h1>
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">Invoice #</th><th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Issued</th><th className="px-4 py-3 text-left">Due</th>
            <th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-right">Balance</th>
          </tr></thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No invoices yet.</td></tr>}
            {data.map((i: any) => (
              <tr key={i.id} className="border-t hover:bg-muted/40">
                <td className="px-4 py-3"><Link to={`/portal/invoices/${i.id}`} className="font-medium text-primary hover:underline">{i.invoice_number}</Link></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${INVOICE_STATUS_VARIANT[i.status]}`}>{INVOICE_STATUS_LABELS[i.status]}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{i.issued_at || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.due_at || "—"}</td>
                <td className="px-4 py-3 text-right">{formatPrice(i.total_cents)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(i.balance_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Invoices;
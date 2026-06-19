import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useInvoice, INVOICE_STATUS_LABELS, INVOICE_STATUS_VARIANT } from "@/hooks/use-invoices";
import { formatPrice } from "@/hooks/use-products";

const InvoiceDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useInvoice(id);
  if (isLoading || !data?.invoice) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  const inv: any = data.invoice;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/portal/invoices" className="text-sm text-muted-foreground hover:underline">← Invoices</Link>
          <h1 className="text-2xl font-bold">{inv.invoice_number}</h1>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${INVOICE_STATUS_VARIANT[inv.status]}`}>{INVOICE_STATUS_LABELS[inv.status]}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Issued</p><p className="font-medium">{inv.issued_at || "—"}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Due</p><p className="font-medium">{inv.due_at || "—"}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Total</p><p className="font-bold">{formatPrice(inv.total_cents)}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Balance due</p><p className="font-bold text-primary">{formatPrice(inv.balance_cents)}</p></div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-2 text-left">Description</th><th className="px-4 py-2 text-right">Qty</th>
            <th className="px-4 py-2 text-right">Unit</th><th className="px-4 py-2 text-right">Line total</th>
          </tr></thead>
          <tbody>
            {data.items.map((it: any) => (
              <tr key={it.id} className="border-t">
                <td className="px-4 py-2">{it.description}</td>
                <td className="px-4 py-2 text-right">{it.qty}</td>
                <td className="px-4 py-2 text-right">{formatPrice(it.unit_price_cents)}</td>
                <td className="px-4 py-2 text-right font-medium">{formatPrice(it.line_total_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.payments.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 font-semibold">Payments received</h2>
          <ul className="space-y-2 text-sm">
            {data.payments.map((p: any) => (
              <li key={p.id} className="flex justify-between border-b pb-2 last:border-0">
                <span>{p.method} · {p.reference || "—"}</span>
                <span className="font-medium">{formatPrice(p.amount_cents)} <span className="text-muted-foreground">· {new Date(p.paid_at).toLocaleDateString()}</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {inv.balance_cents > 0 && (
        <div className="rounded-lg border border-accent/30 bg-accent-soft/30 p-4 text-sm">
          To settle this invoice, please contact our finance team. Online payments are not yet enabled — your account manager will share bank or M-Pesa details.
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useOrder, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANT } from "@/hooks/use-orders";
import { formatPrice } from "@/hooks/use-products";

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useOrder(id);
  if (isLoading || !data?.order) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  const o: any = data.order;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/portal/orders" className="text-sm text-muted-foreground hover:underline">← Orders</Link>
          <h1 className="text-2xl font-bold">{o.order_number}</h1>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${ORDER_STATUS_VARIANT[o.status]}`}>{ORDER_STATUS_LABELS[o.status]}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">PO</p><p className="font-medium">{o.po_number || "—"}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Placed</p><p className="font-medium">{o.placed_at ? new Date(o.placed_at).toLocaleString() : "—"}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Total</p><p className="font-bold text-primary">{formatPrice(o.total_cents)}</p></div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-2 text-left">Item</th><th className="px-4 py-2 text-right">Qty</th>
            <th className="px-4 py-2 text-right">Unit</th><th className="px-4 py-2 text-right">Line total</th>
          </tr></thead>
          <tbody>
            {data.items.map((it: any) => (
              <tr key={it.id} className="border-t">
                <td className="px-4 py-2">{it.description}</td>
                <td className="px-4 py-2 text-right">{it.qty} {it.uom}</td>
                <td className="px-4 py-2 text-right">{formatPrice(it.unit_price_cents)}</td>
                <td className="px-4 py-2 text-right font-medium">{formatPrice(it.line_total_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.shipments.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 font-semibold">Shipments</h2>
          <ul className="space-y-2 text-sm">
            {data.shipments.map((s: any) => (
              <li key={s.id} className="flex justify-between border-b pb-2 last:border-0">
                <span>{s.carrier || "Carrier"} · {s.tracking_number || "no tracking"}</span>
                <span className="text-muted-foreground">{s.status} · {s.shipped_at ? new Date(s.shipped_at).toLocaleDateString() : ""}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {o.notes && <div className="rounded-lg border bg-card p-4"><h2 className="mb-1 text-sm font-semibold">Notes</h2><p className="text-sm text-muted-foreground">{o.notes}</p></div>}
    </div>
  );
};

export default OrderDetail;
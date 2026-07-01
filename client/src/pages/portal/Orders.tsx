import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useOrders, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANT } from "@/hooks/use-orders";
import { formatPrice } from "@/hooks/use-products";

const Orders = () => {
  const { data = [], isLoading } = useOrders();

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">PO</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Placed</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No orders yet. Start from the <Link to="/portal/catalog" className="underline">catalog</Link>.</td></tr>
            )}
            {data.map((o: any) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/40">
                <td className="px-4 py-3"><Link to={`/portal/orders/${o.id}`} className="font-medium text-primary hover:underline">{o.order_number}</Link></td>
                <td className="px-4 py-3 text-muted-foreground">{o.po_number || "—"}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_VARIANT[o.status]}`}>{ORDER_STATUS_LABELS[o.status]}</span></td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total_cents)}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.placed_at ? new Date(o.placed_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;

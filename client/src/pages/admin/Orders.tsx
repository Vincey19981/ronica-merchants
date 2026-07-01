import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders, useUpdateOrderStatus, useCreateInvoiceFromOrder, useCreateShipment, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANT, type OrderStatus } from "@/hooks/use-orders";
import { formatPrice } from "@/hooks/use-products";
import { toast } from "@/hooks/use-toast";

const AdminOrders = () => {
  const { data = [], isLoading } = useOrders({ adminAll: true });
  const update = useUpdateOrderStatus();
  const invoice = useCreateInvoiceFromOrder();
  const ship = useCreateShipment();
  const [busy, setBusy] = useState<string | null>(null);

  const issue = async (id: string) => {
    setBusy(id);
    try { await invoice.mutateAsync(id); toast({ title: "Invoice issued" }); }
    catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setBusy(null); }
  };

  const markShipped = async (id: string) => {
    setBusy(id);
    try {
      await ship.mutateAsync({ order_id: id, carrier: "Internal", tracking_number: "" });
      await update.mutateAsync({ id, status: "shipped" });
      toast({ title: "Shipment recorded" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setBusy(null); }
  };

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin · Orders</h1>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-3 py-3 text-left">Order</th><th className="px-3 py-3 text-left">Org</th>
            <th className="px-3 py-3 text-left">Status</th><th className="px-3 py-3 text-right">Total</th>
            <th className="px-3 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {data.map((o: any) => (
              <tr key={o.id} className="border-t">
                <td className="px-3 py-3"><Link to={`/portal/orders/${o.id}`} className="font-medium text-primary hover:underline">{o.order_number}</Link></td>
                <td className="px-3 py-3">{o.organizations?.name ?? "—"}</td>
                <td className="px-3 py-3">
                  <Select value={o.status} onValueChange={(v) => update.mutate({ id: o.id, status: v as OrderStatus })}>
                    <SelectTrigger className={`h-8 w-40 ${ORDER_STATUS_VARIANT[o.status]}`}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORDER_STATUS_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-3 text-right">{formatPrice(o.total_cents)}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="outline" disabled={busy === o.id} onClick={() => issue(o.id)}>Issue invoice</Button>
                    <Button size="sm" variant="outline" disabled={busy === o.id} onClick={() => markShipped(o.id)}>Mark shipped</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminOrders;
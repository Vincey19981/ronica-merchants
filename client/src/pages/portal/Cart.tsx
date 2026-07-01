import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/hooks/use-products";
import { toast } from "@/hooks/use-toast";
import { useCheckout } from "@/hooks/use-orders";

const PortalCart = () => {
  const { items, updateQty, remove, clear, subtotal_cents, has_unpriced } = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [po, setPo] = useState("");
  const [notes, setNotes] = useState("");

  const placeOrder = async () => {
    try {
      const order = await checkout.mutateAsync({ items, po_number: po, notes });
      clear();
      toast({ title: "Order placed", description: `Order ${(order as any).order_number} submitted.` });
      navigate(`/portal/orders/${(order as any).id}`);
    } catch (e: any) {
      toast({ title: "Could not place order", description: e.message, variant: "destructive" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Browse the catalog to add items.</p>
        <Button asChild variant="gold"><Link to="/portal/catalog">Browse catalog</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Cart ({items.length} {items.length === 1 ? "item" : "items"})</h1>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-right">Unit price</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Line total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.product_id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.sku} · {i.uom}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  {i.unit_price_cents != null ? formatPrice(i.unit_price_cents) : <span className="text-xs text-muted-foreground">Quote</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min={1}
                    value={i.qty}
                    onChange={(e) => updateQty(i.product_id, Math.max(1, parseInt(e.target.value || "1", 10)))}
                    className="h-8 w-16 rounded border border-input bg-background text-center text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {i.unit_price_cents != null ? formatPrice(i.unit_price_cents * i.qty) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => remove(i.product_id)} aria-label="Remove">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-border bg-muted/50">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right font-semibold">Subtotal (priced items)</td>
              <td className="px-4 py-3 text-right font-bold text-primary">{formatPrice(subtotal_cents)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {has_unpriced && (
        <p className="rounded-md border border-accent/30 bg-accent-soft/30 p-3 text-sm text-muted-foreground">
          Some items don't have a contract price. They will be added to your order as "Quote on request" and our team will confirm pricing before invoicing.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => { clear(); toast({ title: "Cart cleared" }); }}>Clear cart</Button>
        <Button asChild variant="outline"><Link to="/portal/catalog">Continue shopping</Link></Button>
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="po">PO number (optional)</Label>
          <Input id="po" value={po} onChange={(e) => setPo(e.target.value)} placeholder="e.g. PO-2026-0123" />
        </div>
        <div className="space-y-1 sm:row-span-2">
          <Label htmlFor="notes">Notes for our team</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </div>
        <div className="sm:col-span-2 flex items-center justify-end gap-3">
          <p className="text-sm text-muted-foreground">Total: <strong className="text-foreground">{formatPrice(subtotal_cents)}</strong></p>
          <Button variant="gold" onClick={placeOrder} disabled={checkout.isPending}>
            {checkout.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortalCart;
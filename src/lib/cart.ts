// Simple localStorage-backed cart for the portal catalog. Phase 4 will
// upgrade this into server-side orders.
import { useEffect, useState, useCallback } from "react";

export interface CartItem {
  product_id: string;
  sku: string;
  name: string;
  uom: string;
  qty: number;
  unit_price_cents: number | null; // null = quote on request
}

const KEY = "ronica.cart.v1";
const EVENT = "ronica:cart-change";

const read = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => read());

  useEffect(() => {
    const handler = () => setItems(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const add = useCallback((item: Omit<CartItem, "qty"> & { qty?: number }) => {
    const current = read();
    const idx = current.findIndex((c) => c.product_id === item.product_id);
    if (idx >= 0) {
      current[idx].qty += item.qty ?? 1;
    } else {
      current.push({ ...item, qty: item.qty ?? 1 });
    }
    write(current);
  }, []);

  const updateQty = useCallback((product_id: string, qty: number) => {
    const current = read().map((c) => (c.product_id === product_id ? { ...c, qty } : c)).filter((c) => c.qty > 0);
    write(current);
  }, []);

  const remove = useCallback((product_id: string) => {
    write(read().filter((c) => c.product_id !== product_id));
  }, []);

  const clear = useCallback(() => write([]), []);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal_cents = items.reduce((n, i) => n + (i.unit_price_cents ?? 0) * i.qty, 0);
  const has_unpriced = items.some((i) => i.unit_price_cents == null);

  return { items, add, updateQty, remove, clear, count, subtotal_cents, has_unpriced };
};
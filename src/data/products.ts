export type ProductCategory =
  | "Stationery"
  | "Paper"
  | "Toner & Ink"
  | "Furniture"
  | "Cleaning"
  | "Technology"
  | "Packaging";

export interface Product {
  name: string;
  category: ProductCategory;
  uom: string;
}

export const PRODUCTS: Product[] = [
  { name: "A4 Copy Paper 80gsm", category: "Paper", uom: "per ream / box of 5 / carton" },
  { name: "Biro Pens (Assorted Colours)", category: "Stationery", uom: "per box of 50" },
  { name: "Heavy Duty Stapler", category: "Stationery", uom: "per unit" },
  { name: "HP 85A Toner Cartridge", category: "Toner & Ink", uom: "per unit" },
  { name: "Executive Office Chair", category: "Furniture", uom: "per unit" },
  { name: "Whiteboard Markers", category: "Stationery", uom: "per set of 4" },
  { name: "Hand Sanitiser 500ml", category: "Cleaning", uom: "per unit / per carton" },
  { name: "Manila Envelopes A4", category: "Stationery", uom: "per box of 50" },
  { name: "Correction Fluid", category: "Stationery", uom: "per unit" },
  { name: "Flipchart Stand + Pads", category: "Stationery", uom: "per set" },
  { name: "Laser Printer A4 Mono", category: "Technology", uom: "per unit" },
  { name: "Mop & Bucket Set", category: "Cleaning", uom: "per unit" },
  { name: "Box Files (Foolscap)", category: "Stationery", uom: "per unit / per dozen" },
  { name: "Conference Table 8-Seater", category: "Furniture", uom: "per unit" },
  { name: "Canon 045 Toner", category: "Toner & Ink", uom: "per unit" },
  { name: "USB Flash Drive 32GB", category: "Technology", uom: "per unit / per box of 10" },
  { name: "Carton Sealing Tape", category: "Packaging", uom: "per roll / per box" },
  { name: "Office Filing Cabinet 4-Drawer", category: "Furniture", uom: "per unit" },
];

export const CATEGORY_ICONS: Record<string, string> = {
  Stationery: "✎",
  Paper: "📄",
  "Toner & Ink": "🖨",
  Furniture: "🪑",
  Cleaning: "🧴",
  Technology: "💻",
  Packaging: "📦",
};
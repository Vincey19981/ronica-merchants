export type ProductCategory =
  | "Office Stationery"
  | "Printer Consumables"
  | "Computers & Accessories"
  | "Networking Equipment"
  | "Software & Antivirus";

export interface Product {
  name: string;
  category: ProductCategory;
  uom: string;
}

export const PRODUCTS: Product[] = [
  { name: "A4 Copy Paper 80gsm", category: "Office Stationery", uom: "quantities quoted on request" },
  { name: "A3 Copy Paper 80gsm", category: "Office Stationery", uom: "quantities quoted on request" },
  { name: "Counter Books and Notebooks", category: "Office Stationery", uom: "quantities quoted on request" },
  { name: "Pens, Pencils and Markers", category: "Office Stationery", uom: "quantities quoted on request" },
  { name: "Files, Folders and Envelopes", category: "Office Stationery", uom: "quantities quoted on request" },
  { name: "Staplers, Punches and Desk Supplies", category: "Office Stationery", uom: "quantities quoted on request" },

  { name: "HP 85A Toner Cartridge", category: "Printer Consumables", uom: "quantities quoted on request" },
  { name: "HP 12A Toner Cartridge", category: "Printer Consumables", uom: "quantities quoted on request" },
  { name: "Canon Toner Cartridges", category: "Printer Consumables", uom: "quantities quoted on request" },
  { name: "Epson Ink Bottles", category: "Printer Consumables", uom: "quantities quoted on request" },
  { name: "Printer Drums and Maintenance Kits", category: "Printer Consumables", uom: "quantities quoted on request" },

  { name: "Business Laptops", category: "Computers & Accessories", uom: "quantities quoted on request" },
  { name: "Desktop Computers", category: "Computers & Accessories", uom: "quantities quoted on request" },
  { name: "Monitors", category: "Computers & Accessories", uom: "quantities quoted on request" },
  { name: "Keyboards, Mice and Peripherals", category: "Computers & Accessories", uom: "quantities quoted on request" },
  { name: "External Storage and Flash Drives", category: "Computers & Accessories", uom: "quantities quoted on request" },

  { name: "Network Switches", category: "Networking Equipment", uom: "quantities quoted on request" },
  { name: "Wi-Fi Routers", category: "Networking Equipment", uom: "quantities quoted on request" },
  { name: "Ethernet Cables and Patch Cords", category: "Networking Equipment", uom: "quantities quoted on request" },
  { name: "Network Cabinets and Accessories", category: "Networking Equipment", uom: "quantities quoted on request" },
  { name: "UPS and Surge Protection", category: "Networking Equipment", uom: "quantities quoted on request" },

  { name: "Antivirus Licences", category: "Software & Antivirus", uom: "quantities quoted on request" },
  { name: "Office Productivity Software", category: "Software & Antivirus", uom: "quantities quoted on request" },
  { name: "Endpoint Protection", category: "Software & Antivirus", uom: "quantities quoted on request" },
  { name: "Software Licence Renewals", category: "Software & Antivirus", uom: "quantities quoted on request" },
];

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  "Office Stationery": "FileText",
  "Printer Consumables": "Printer",
  "Computers & Accessories": "Laptop",
  "Networking Equipment": "Network",
  "Software & Antivirus": "ShieldCheck",
};

export const CATEGORY_THEME: Record<
  ProductCategory,
  { tint: string; iconName: "FileText" | "Printer" | "Laptop" | "Network" | "ShieldCheck" }
> = {
  "Office Stationery": { tint: "#FFF8E7", iconName: "FileText" },
  "Printer Consumables": { tint: "#EEF0F8", iconName: "Printer" },
  "Computers & Accessories": { tint: "#F5F0FF", iconName: "Laptop" },
  "Networking Equipment": { tint: "#EEF7F7", iconName: "Network" },
  "Software & Antivirus": { tint: "#F0F7F0", iconName: "ShieldCheck" },
};
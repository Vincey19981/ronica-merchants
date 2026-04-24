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
  // ─── Paper ───────────────────────────────────────────────
  { name: "A4 Copy Paper 80gsm", category: "Paper", uom: "per ream / box of 5 / carton" },
  { name: "A3 Copy Paper 80gsm", category: "Paper", uom: "per ream / carton" },
  { name: "A4 Coloured Paper (Assorted)", category: "Paper", uom: "per ream" },
  { name: "A4 Bond Paper 100gsm", category: "Paper", uom: "per ream" },
  { name: "Photocopy Paper 70gsm", category: "Paper", uom: "per ream / carton" },
  { name: "Carbonless NCR Paper", category: "Paper", uom: "per ream" },
  { name: "Sticky Notes 3x3 (Assorted)", category: "Paper", uom: "per pack of 12" },
  { name: "Notebooks A4 Hardcover", category: "Paper", uom: "per unit / per dozen" },
  { name: "Counter Books A4 (96 / 192 / 384 pages)", category: "Paper", uom: "per unit" },
  { name: "Receipt Books (Duplicate / Triplicate)", category: "Paper", uom: "per unit" },
  { name: "Delivery Note Books", category: "Paper", uom: "per unit" },
  { name: "Invoice Books", category: "Paper", uom: "per unit" },

  // ─── Stationery ──────────────────────────────────────────
  { name: "Biro Pens (Blue / Black / Red)", category: "Stationery", uom: "per box of 50" },
  { name: "Gel Pens (Assorted Colours)", category: "Stationery", uom: "per box of 12" },
  { name: "Permanent Markers", category: "Stationery", uom: "per set of 4" },
  { name: "Whiteboard Markers", category: "Stationery", uom: "per set of 4" },
  { name: "Highlighters (Assorted)", category: "Stationery", uom: "per pack of 6" },
  { name: "HB Pencils", category: "Stationery", uom: "per box of 12" },
  { name: "Mechanical Pencils 0.5mm", category: "Stationery", uom: "per pack" },
  { name: "Eraser & Sharpener Set", category: "Stationery", uom: "per pack" },
  { name: "Wooden Rulers 30cm", category: "Stationery", uom: "per dozen" },
  { name: "Heavy Duty Stapler", category: "Stationery", uom: "per unit" },
  { name: "Standard Stapler + Pins", category: "Stationery", uom: "per unit" },
  { name: "Staple Pins No. 24/6", category: "Stationery", uom: "per box" },
  { name: "Paper Clips (Assorted Sizes)", category: "Stationery", uom: "per box" },
  { name: "Binder Clips (Assorted)", category: "Stationery", uom: "per pack" },
  { name: "Punch Machine 2-Hole", category: "Stationery", uom: "per unit" },
  { name: "Heavy Duty 4-Hole Punch", category: "Stationery", uom: "per unit" },
  { name: "Scissors (Office Grade)", category: "Stationery", uom: "per unit" },
  { name: "Glue Sticks 40g", category: "Stationery", uom: "per pack of 12" },
  { name: "Liquid Glue 250ml", category: "Stationery", uom: "per unit" },
  { name: "Correction Fluid", category: "Stationery", uom: "per unit" },
  { name: "Correction Tape", category: "Stationery", uom: "per pack" },
  { name: "Manila Envelopes A4", category: "Stationery", uom: "per box of 50" },
  { name: "Brown Envelopes A5 / A4 / A3", category: "Stationery", uom: "per box" },
  { name: "Window Envelopes DL", category: "Stationery", uom: "per box of 100" },
  { name: "Box Files (Foolscap)", category: "Stationery", uom: "per unit / per dozen" },
  { name: "Lever Arch Files", category: "Stationery", uom: "per unit / per dozen" },
  { name: "Spring Files", category: "Stationery", uom: "per dozen" },
  { name: "Document Wallets", category: "Stationery", uom: "per pack" },
  { name: "Clear Sheet Protectors A4", category: "Stationery", uom: "per pack of 100" },
  { name: "Ring Binders 2-Ring / 4-Ring", category: "Stationery", uom: "per unit" },
  { name: "Index Dividers (1-12 / A-Z)", category: "Stationery", uom: "per pack" },
  { name: "ID Card Holders + Lanyards", category: "Stationery", uom: "per pack" },
  { name: "Desk Organiser Tray", category: "Stationery", uom: "per unit" },
  { name: "Letter Trays 3-Tier", category: "Stationery", uom: "per unit" },
  { name: "Whiteboard 4ft x 3ft", category: "Stationery", uom: "per unit" },
  { name: "Cork Notice Board", category: "Stationery", uom: "per unit" },
  { name: "Flipchart Stand + Pads", category: "Stationery", uom: "per set" },
  { name: "Date / Number Stamps", category: "Stationery", uom: "per unit" },
  { name: "Stamp Pads + Refill Ink", category: "Stationery", uom: "per unit" },
  { name: "Calculators (Desk / Scientific)", category: "Stationery", uom: "per unit" },

  // ─── Toner & Ink ─────────────────────────────────────────
  { name: "HP 85A Toner Cartridge", category: "Toner & Ink", uom: "per unit" },
  { name: "HP 12A Toner Cartridge", category: "Toner & Ink", uom: "per unit" },
  { name: "HP 17A / 30A / 79A Toner", category: "Toner & Ink", uom: "per unit" },
  { name: "HP 410A Colour Toner Set", category: "Toner & Ink", uom: "per set of 4" },
  { name: "Canon 045 Toner", category: "Toner & Ink", uom: "per unit" },
  { name: "Canon 325 / 337 Toner", category: "Toner & Ink", uom: "per unit" },
  { name: "Brother TN-2380 Toner", category: "Toner & Ink", uom: "per unit" },
  { name: "Samsung MLT-D101S Toner", category: "Toner & Ink", uom: "per unit" },
  { name: "Kyocera TK Series Toner", category: "Toner & Ink", uom: "per unit" },
  { name: "Epson 003 Ink Bottles (CMYK)", category: "Toner & Ink", uom: "per set" },
  { name: "Epson 664 Ink Bottles (CMYK)", category: "Toner & Ink", uom: "per set" },
  { name: "HP GT53 Black Ink", category: "Toner & Ink", uom: "per unit" },
  { name: "Ribbon Cartridges (Dot Matrix)", category: "Toner & Ink", uom: "per unit" },

  // ─── Furniture ───────────────────────────────────────────
  { name: "Executive Office Chair (Leather)", category: "Furniture", uom: "per unit" },
  { name: "Ergonomic Mesh Office Chair", category: "Furniture", uom: "per unit" },
  { name: "Visitor / Reception Chair", category: "Furniture", uom: "per unit" },
  { name: "Stackable Conference Chair", category: "Furniture", uom: "per unit" },
  { name: "Executive Desk 1.6m", category: "Furniture", uom: "per unit" },
  { name: "Workstation Desk (L-Shape)", category: "Furniture", uom: "per unit" },
  { name: "Office Workstations (4-Pod)", category: "Furniture", uom: "per set" },
  { name: "Conference Table 8-Seater", category: "Furniture", uom: "per unit" },
  { name: "Boardroom Table 12-Seater", category: "Furniture", uom: "per unit" },
  { name: "Reception Counter / Desk", category: "Furniture", uom: "per unit" },
  { name: "Office Filing Cabinet 4-Drawer", category: "Furniture", uom: "per unit" },
  { name: "Mobile Pedestal 3-Drawer", category: "Furniture", uom: "per unit" },
  { name: "Bookshelf / Open Shelving Unit", category: "Furniture", uom: "per unit" },
  { name: "Lockers (6 / 9 / 12 Compartments)", category: "Furniture", uom: "per unit" },
  { name: "Fireproof Safe", category: "Furniture", uom: "per unit" },
  { name: "Coat Stand / Hat Rack", category: "Furniture", uom: "per unit" },
  { name: "Office Sofa Set (3+1+1)", category: "Furniture", uom: "per set" },
  { name: "Coffee Table (Reception)", category: "Furniture", uom: "per unit" },

  // ─── Cleaning ────────────────────────────────────────────
  { name: "Hand Sanitiser 500ml", category: "Cleaning", uom: "per unit / per carton" },
  { name: "Hand Sanitiser 5L Refill", category: "Cleaning", uom: "per unit" },
  { name: "Liquid Hand Soap 5L", category: "Cleaning", uom: "per unit" },
  { name: "Bathroom Tissue 2-Ply", category: "Cleaning", uom: "per pack of 10 / bale" },
  { name: "Kitchen Roll / Paper Towels", category: "Cleaning", uom: "per pack" },
  { name: "Facial Tissue Boxes", category: "Cleaning", uom: "per pack" },
  { name: "Disinfectant 5L (Pine / Lemon)", category: "Cleaning", uom: "per unit" },
  { name: "Multi-Surface Cleaner 5L", category: "Cleaning", uom: "per unit" },
  { name: "Toilet Bowl Cleaner", category: "Cleaning", uom: "per unit" },
  { name: "Glass Cleaner 500ml", category: "Cleaning", uom: "per unit" },
  { name: "Bleach 5L", category: "Cleaning", uom: "per unit" },
  { name: "Dishwashing Liquid 5L", category: "Cleaning", uom: "per unit" },
  { name: "Air Freshener (Spray / Automatic)", category: "Cleaning", uom: "per unit" },
  { name: "Mop & Bucket Set", category: "Cleaning", uom: "per unit" },
  { name: "Industrial Mop Heads", category: "Cleaning", uom: "per unit" },
  { name: "Brooms (Soft / Hard)", category: "Cleaning", uom: "per unit" },
  { name: "Dustpan & Brush Set", category: "Cleaning", uom: "per unit" },
  { name: "Microfibre Cleaning Cloths", category: "Cleaning", uom: "per pack of 10" },
  { name: "Scouring Pads", category: "Cleaning", uom: "per pack" },
  { name: "Garbage Bags (Heavy Duty)", category: "Cleaning", uom: "per roll / carton" },
  { name: "Pedal Bins 30L / 50L", category: "Cleaning", uom: "per unit" },
  { name: "Disposable Gloves (Latex / Nitrile)", category: "Cleaning", uom: "per box of 100" },
  { name: "Face Masks 3-Ply", category: "Cleaning", uom: "per box of 50" },
  { name: "First Aid Kit (Office Standard)", category: "Cleaning", uom: "per unit" },

  // ─── Technology ──────────────────────────────────────────
  { name: "Laser Printer A4 Mono", category: "Technology", uom: "per unit" },
  { name: "Colour Laser Printer A4", category: "Technology", uom: "per unit" },
  { name: "Multifunction Printer (Print/Scan/Copy)", category: "Technology", uom: "per unit" },
  { name: "Heavy Duty Photocopier", category: "Technology", uom: "per unit" },
  { name: "Document Scanner", category: "Technology", uom: "per unit" },
  { name: "Paper Shredder (Cross-Cut)", category: "Technology", uom: "per unit" },
  { name: "Laminating Machine A4 / A3", category: "Technology", uom: "per unit" },
  { name: "Laminating Pouches A4", category: "Technology", uom: "per pack of 100" },
  { name: "Spiral Binding Machine", category: "Technology", uom: "per unit" },
  { name: "Binding Combs & Covers", category: "Technology", uom: "per pack" },
  { name: "UPS 650VA / 1000VA", category: "Technology", uom: "per unit" },
  { name: "Surge Protector Power Strips", category: "Technology", uom: "per unit" },
  { name: "Extension Cables 4-Way / 6-Way", category: "Technology", uom: "per unit" },
  { name: "Desktop Computer (i5 / i7)", category: "Technology", uom: "per unit" },
  { name: "Laptop (Business Grade)", category: "Technology", uom: "per unit" },
  { name: "LED Monitor 22\" / 24\"", category: "Technology", uom: "per unit" },
  { name: "Wireless Keyboard & Mouse Set", category: "Technology", uom: "per set" },
  { name: "USB Flash Drive 32GB / 64GB", category: "Technology", uom: "per unit / per box of 10" },
  { name: "External Hard Drive 1TB / 2TB", category: "Technology", uom: "per unit" },
  { name: "HDMI / VGA / USB Cables", category: "Technology", uom: "per unit" },
  { name: "Network Switches 8 / 16 / 24 Port", category: "Technology", uom: "per unit" },
  { name: "Wi-Fi Router (Dual Band)", category: "Technology", uom: "per unit" },
  { name: "CCTV Camera Kit (4-Channel)", category: "Technology", uom: "per set" },
  { name: "Projector (HD / Full HD)", category: "Technology", uom: "per unit" },
  { name: "Projector Screen 96\"", category: "Technology", uom: "per unit" },
  { name: "Conference Speakerphone", category: "Technology", uom: "per unit" },
  { name: "Desk Telephone (PABX)", category: "Technology", uom: "per unit" },

  // ─── Packaging ───────────────────────────────────────────
  { name: "Carton Sealing Tape (Brown / Clear)", category: "Packaging", uom: "per roll / per box" },
  { name: "Masking Tape (Assorted Sizes)", category: "Packaging", uom: "per roll / box" },
  { name: "Double-Sided Tape", category: "Packaging", uom: "per roll" },
  { name: "Stretch Wrap / Cling Film", category: "Packaging", uom: "per roll" },
  { name: "Bubble Wrap (Rolls)", category: "Packaging", uom: "per roll" },
  { name: "Corrugated Cartons (Assorted)", category: "Packaging", uom: "per unit / per bale" },
  { name: "Mailing / Courier Bags", category: "Packaging", uom: "per pack of 100" },
  { name: "Padded Envelopes", category: "Packaging", uom: "per pack" },
  { name: "Strapping Bands + Buckles", category: "Packaging", uom: "per roll" },
  { name: "Shipping Labels A4", category: "Packaging", uom: "per pack of 100" },
  { name: "Thermal Receipt Rolls 80mm", category: "Packaging", uom: "per box" },
  { name: "Barcode Labels (Rolls)", category: "Packaging", uom: "per roll" },
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

/**
 * Per-category visual identity. Light tint band behind a navy icon —
 * gives each card a distinct identity without leaving the brand palette.
 */
export const CATEGORY_THEME: Record<
  ProductCategory,
  { tint: string; iconName: "PenLine" | "FileText" | "Printer" | "Armchair" | "SprayCan" | "Laptop" | "PackageOpen" }
> = {
  Stationery: { tint: "#FFF8E7", iconName: "PenLine" },
  Paper: { tint: "#EEF2FF", iconName: "FileText" },
  "Toner & Ink": { tint: "#EEF0F8", iconName: "Printer" },
  Furniture: { tint: "#F0F7F0", iconName: "Armchair" },
  Cleaning: { tint: "#EEF7F7", iconName: "SprayCan" },
  Technology: { tint: "#F5F0FF", iconName: "Laptop" },
  Packaging: { tint: "#FFF3EE", iconName: "PackageOpen" },
};
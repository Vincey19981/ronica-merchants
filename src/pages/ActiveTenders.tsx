import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";

const tenders = [
  { ref: "RM/T/2025/001", client: "[County Government — Sample]", category: "Stationery & Paper", status: "Quoting", date: "2025-01-12" },
  { ref: "RM/T/2025/002", client: "[Public School — Sample]", category: "Furniture & Equipment", status: "Awarded", date: "2025-01-08" },
  { ref: "RM/T/2025/003", client: "[NGO — Sample]", category: "Toner & Printer Supplies", status: "Quoting", date: "2025-01-05" },
  { ref: "RM/T/2025/004", client: "[Ministry — Sample]", category: "Cleaning & Hygiene", status: "Delivering", date: "2024-12-22" },
];

const statusStyles: Record<string, string> = {
  Quoting: "bg-accent-soft text-accent-foreground border-accent/40",
  Awarded: "bg-success/10 text-success border-success/30",
  Delivering: "bg-primary/10 text-primary border-primary/30",
};

const ActiveTenders = () => (
  <Layout>
    <PageHero eyebrow="Active Tenders & Quotations" title="Tenders we are actively pursuing.">
      We participate in public and private sector tenders across Kenya. If your
      organization has an upcoming procurement need, reach out early — we move fast
      and our compliance documentation is always ready.
    </PageHero>

    <section className="bg-background py-16">
      <div className="container-tight">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-primary">
                  <th className="px-5 py-4">Tender Reference</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenders.map((t) => (
                  <tr key={t.ref} className="hover:bg-surface/50">
                    <td className="px-5 py-4 font-semibold text-primary">{t.ref}</td>
                    <td className="px-5 py-4 text-muted-foreground">{t.client}</td>
                    <td className="px-5 py-4 text-muted-foreground">{t.category}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Sample entries shown for illustration. Updated regularly. Contact us if your tender is
          not listed — we will quote.
        </p>
      </div>
    </section>

    <section className="bg-surface py-16">
      <div className="container-tight">
        <h2 className="text-2xl font-bold text-primary gold-underline">Downloads</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { title: "Quotation Request Form", body: "Standard form for submitting your enquiry by email.", file: "Quotation-Request-Form.pdf" },
            { title: "Company Profile", body: "Overview of services, capabilities, and compliance documentation.", file: "Ronica-Company-Profile.pdf" },
          ].map((d) => (
            <div key={d.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-primary">{d.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.body}</p>
                <Button asChild variant="goldOutline" size="sm" className="mt-4">
                  <a href="#" download={d.file}>
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default ActiveTenders;
import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenders, STATUS_LABELS, STATUS_TONE } from "@/hooks/use-tenders";
import { useAuth } from "@/lib/auth";

const formatDate = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const PortalTenders = () => {
  const { data: tenders = [], isLoading } = useTenders();
  const { hasRole, isAdmin } = useAuth();
  const canCreate = isAdmin || hasRole("procurement_officer");

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tenders</h1>
          <p className="text-sm text-muted-foreground">Track your tender submissions and their status.</p>
        </div>
        {canCreate && (
          <Button asChild variant="gold">
            <Link to="/portal/tenders/new"><Plus className="mr-2 h-4 w-4" /> New tender</Link>
          </Button>
        )}
      </header>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : tenders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold text-foreground">No tenders yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {canCreate ? "Create your first tender to get started." : "No tenders have been created for your organisation."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Buyer</th>
                <th className="px-4 py-3 text-left">Deadline</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link to={`/portal/tenders/${t.id}`} className="text-primary hover:underline">{t.reference}</Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{t.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.buyer_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(t.submission_deadline)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_TONE[t.status]}`}>
                      {STATUS_LABELS[t.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PortalTenders;
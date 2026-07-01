import { Loader2 } from "lucide-react";
import { useAssets } from "@/hooks/use-assets";

const Assets = () => {
  const { data = [], isLoading } = useAssets();
  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Asset register</h1>
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">Tag</th><th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Model</th><th className="px-4 py-3 text-left">Serial</th>
            <th className="px-4 py-3 text-left">Assigned to</th><th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Warranty</th><th className="px-4 py-3 text-left">Status</th>
          </tr></thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No assets registered yet.</td></tr>}
            {data.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{a.asset_tag}</td>
                <td className="px-4 py-3">{a.type || "—"}</td>
                <td className="px-4 py-3">{a.manufacturer} {a.model}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.serial || "—"}</td>
                <td className="px-4 py-3">{a.assigned_to || "—"}</td>
                <td className="px-4 py-3">{a.location || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.warranty_end || "—"}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Assets;
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuditLog } from "@/hooks/use-audit";

const RESOURCE_TYPES = ["all","order","invoice","ticket","tender","asset"];

const Audit = () => {
  const [rt, setRt] = useState("all");
  const [action, setAction] = useState("");
  const { data = [], isLoading } = useAuditLog({
    resource_type: rt === "all" ? undefined : rt,
    action: action || undefined,
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Audit log</h1>
      <div className="flex flex-wrap gap-3">
        <Select value={rt} onValueChange={setRt}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{RESOURCE_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
        <Input placeholder="Action contains…" value={action} onChange={(e) => setAction(e.target.value)} className="w-64" />
      </div>

      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
              <th className="px-3 py-3 text-left">When</th><th className="px-3 py-3 text-left">Actor</th>
              <th className="px-3 py-3 text-left">Action</th><th className="px-3 py-3 text-left">Resource</th>
              <th className="px-3 py-3 text-left">Detail</th>
            </tr></thead>
            <tbody>
              {data.map((e: any) => (
                <tr key={e.id} className="border-t">
                  <td className="px-3 py-3 text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="px-3 py-3 font-mono text-xs">{e.actor_id?.slice(0,8) ?? "system"}</td>
                  <td className="px-3 py-3">{e.action}</td>
                  <td className="px-3 py-3">{e.resource_type} · {e.resource_id?.slice(0,8)}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground"><code>{e.after ? JSON.stringify(e.after) : ""}</code></td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No audit entries.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Audit;
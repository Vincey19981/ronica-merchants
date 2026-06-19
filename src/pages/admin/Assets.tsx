import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAssets, useUpsertAsset, useDeleteAsset } from "@/hooks/use-assets";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const AdminAssets = () => {
  const { profile } = useAuth();
  const { data = [], isLoading } = useAssets();
  const upsert = useUpsertAsset();
  const del = useDeleteAsset();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ asset_tag: "", type: "", manufacturer: "", model: "", serial: "", assigned_to: "", location: "", warranty_end: "" });

  const create = async () => {
    try {
      await upsert.mutateAsync({ ...form, org_id: profile?.org_id, status: "active", warranty_end: form.warranty_end || null });
      toast({ title: "Asset created" });
      setOpen(false);
      setForm({ asset_tag: "", type: "", manufacturer: "", model: "", serial: "", assigned_to: "", location: "", warranty_end: "" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin · Assets</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="gold"><Plus className="mr-2 h-4 w-4" /> New asset</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New asset</DialogTitle></DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["asset_tag","type","manufacturer","model","serial","assigned_to","location"] as const).map((k) => (
                <div key={k} className="space-y-1"><Label className="capitalize">{k.replace(/_/g," ")}</Label>
                  <Input value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
              <div className="space-y-1"><Label>Warranty end</Label><Input type="date" value={form.warranty_end} onChange={(e) => setForm({ ...form, warranty_end: e.target.value })} /></div>
            </div>
            <Button onClick={create} variant="gold" disabled={!form.asset_tag || upsert.isPending}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
            <th className="px-3 py-3 text-left">Tag</th><th className="px-3 py-3 text-left">Org</th>
            <th className="px-3 py-3 text-left">Type</th><th className="px-3 py-3 text-left">Model</th>
            <th className="px-3 py-3 text-left">Assigned</th><th className="px-3 py-3"></th>
          </tr></thead>
          <tbody>
            {data.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="px-3 py-3 font-mono text-xs">{a.asset_tag}</td>
                <td className="px-3 py-3">{a.organizations?.name ?? "—"}</td>
                <td className="px-3 py-3">{a.type || "—"}</td>
                <td className="px-3 py-3">{a.manufacturer} {a.model}</td>
                <td className="px-3 py-3">{a.assigned_to || "—"}</td>
                <td className="px-3 py-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => del.mutate(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminAssets;
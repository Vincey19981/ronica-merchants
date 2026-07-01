import { useState } from "react";
import { Loader2, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComplianceDocs, useUploadCompliance, getComplianceSignedUrl } from "@/hooks/use-compliance";
import { toast } from "@/hooks/use-toast";

const DOC_TYPES = ["kra_pin","tax_compliance","business_permit","incorporation","insurance","other"];

const Documents = () => {
  const { data = [], isLoading } = useComplianceDocs();
  const upload = useUploadCompliance();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("kra_pin");
  const [issued, setIssued] = useState("");
  const [expires, setExpires] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await upload.mutateAsync({ file, title, doc_type: docType, issued_at: issued, expires_at: expires });
      toast({ title: "Document uploaded" });
      setFile(null); setTitle(""); setIssued(""); setExpires("");
    } catch (e: any) { toast({ title: "Upload failed", description: e.message, variant: "destructive" }); }
  };

  const open = async (downloadPath: string) => {
    try { window.open(await getComplianceSignedUrl(downloadPath), "_blank"); }
    catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Compliance documents</h1>

      <form onSubmit={submit} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2">
        <div className="space-y-1"><Label>Document type</Label>
          <Select value={docType} onValueChange={setDocType}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{DOC_TYPES.map((d) => <SelectItem key={d} value={d}>{d.replace(/_/g," ")}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="space-y-1"><Label>Issued</Label><Input type="date" value={issued} onChange={(e) => setIssued(e.target.value)} /></div>
        <div className="space-y-1"><Label>Expires</Label><Input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} /></div>
        <div className="space-y-1 sm:col-span-2"><Label>File</Label>
          <Input type="file" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <Button type="submit" variant="gold" disabled={!file || upload.isPending} className="sm:col-span-2 w-fit">
          {upload.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Upload
        </Button>
      </form>

      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr>
              <th className="px-4 py-3 text-left">Title</th><th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Issued</th><th className="px-4 py-3 text-left">Expires</th>
              <th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3"></th>
            </tr></thead>
            <tbody>
              {data.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No documents uploaded.</td></tr>}
              {data.map((d: any) => {
                const expSoon = d.expires_at && new Date(d.expires_at) < new Date(Date.now() + 30 * 86400000);
                const expired = d.expires_at && new Date(d.expires_at) < new Date();
                return (
                  <tr key={d.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{d.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.doc_type}</td>
                    <td className="px-4 py-3">{d.issued_at || "—"}</td>
                    <td className={`px-4 py-3 ${expired ? "text-destructive font-semibold" : expSoon ? "text-amber-600" : ""}`}>{d.expires_at || "—"}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{expired ? "expired" : d.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => open(d.download_url)}><ExternalLink className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Documents;

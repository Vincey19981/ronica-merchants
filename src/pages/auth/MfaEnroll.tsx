import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const MfaEnroll = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const [factorId, setFactorId] = useState<string>("");
  const [qr, setQr] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      // Clean up any unverified factors first
      const { data: list } = await supabase.auth.mfa.listFactors();
      for (const f of list?.all ?? []) {
        if (f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Ronica Portal (${new Date().toISOString().slice(0, 10)})`,
      });
      if (error) return toast({ title: "MFA setup failed", description: error.message, variant: "destructive" });
      setFactorId(data.id);
      if (data.type === "totp") {
        setQr(data.totp.qr_code);
        setSecret(data.totp.secret);
      }
    })();
  }, [toast]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    setBusy(true);
    const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({ factorId });
    if (chErr || !challenge) {
      setBusy(false);
      return toast({ title: "Challenge failed", description: chErr?.message, variant: "destructive" });
    }
    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code });
    setBusy(false);
    if (error) return toast({ title: "Invalid code", description: error.message, variant: "destructive" });
    await supabase.from("profiles").update({ mfa_enrolled: true }).eq("id", (await supabase.auth.getUser()).data.user!.id);
    await refresh();
    toast({ title: "MFA enabled", description: "Your account is now protected by an authenticator app." });
    navigate("/portal/profile", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set up two-factor authentication</CardTitle>
          <CardDescription>Scan the QR code with Google Authenticator, 1Password, or Authy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {qr ? (
            <div className="flex flex-col items-center gap-3 rounded-md border bg-background p-4">
              <img src={qr} alt="MFA QR code" className="h-44 w-44" />
              <p className="break-all text-center text-xs text-muted-foreground">
                Or enter this key manually: <span className="font-mono">{secret}</span>
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <form onSubmit={verify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">6-digit code</Label>
              <Input id="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
            </div>
            <Button type="submit" variant="navy" className="w-full" disabled={busy || !factorId}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Verify & enable
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MfaEnroll;
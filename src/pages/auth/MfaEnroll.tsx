import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MfaEnroll = () => (
  <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Security settings
        </CardTitle>
        <CardDescription>
          This MERN version uses JWT sessions. Backend-owned MFA can be added during production hardening.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="navy" className="w-full">
          <Link to="/portal/profile">Back to profile</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default MfaEnroll;

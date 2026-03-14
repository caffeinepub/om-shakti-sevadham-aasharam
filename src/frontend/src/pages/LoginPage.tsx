import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import type { backendInterface } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginPageProps {
  onRegistered: () => void;
  actor: backendInterface | null;
  setPage: (p: Page) => void;
  showRegisterOnly?: boolean;
}

export default function LoginPage({
  onRegistered,
  actor,
  showRegisterOnly,
}: LoginPageProps) {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!actor) {
      toast.error("कृपया पहले लॉगिन करें");
      return;
    }
    if (!name || !mobile || !password) {
      toast.error("सभी फ़ील्ड भरें");
      return;
    }
    setLoading(true);
    try {
      const passwordHash = btoa(password);
      await actor.registerUser(name, mobile, passwordHash);
      toast.success("पंजीकरण सफल!");
      onRegistered();
    } catch (e) {
      toast.error(`पंजीकरण विफल: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Toaster />
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🕉️</div>
        <h1 className="font-display text-3xl font-bold text-primary">
          ओम शक्ति सेवाधाम
        </h1>
        <p className="text-muted-foreground mt-1">
          भक्ति, सेवा और आध्यात्मिक जागरण का केंद्र
        </p>
      </div>

      {!identity ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="font-display text-xl">लॉगिन करें</CardTitle>
            <CardDescription>
              आश्रम से जुड़ने के लिए Internet Identity से लॉगिन करें
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "🔐 "
              )}
              {isLoggingIn ? "लॉगिन हो रहा है..." : "Internet Identity से लॉगिन"}
            </Button>
          </CardContent>
        </Card>
      ) : showRegisterOnly ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="font-display text-xl">पंजीकरण करें</CardTitle>
            <CardDescription>
              आश्रम सदस्य बनने के लिए अपनी जानकारी भरें
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">नाम</Label>
              <Input
                id="name"
                placeholder="आपका पूरा नाम"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="register.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mobile">मोबाइल नंबर</Label>
              <Input
                id="mobile"
                placeholder="मोबाइल नंबर"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                data-ocid="register.mobile.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">पासवर्ड</Label>
              <Input
                id="password"
                type="password"
                placeholder="पासवर्ड बनाएं"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-ocid="register.password.input"
              />
            </div>
            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full"
              data-ocid="register.submit_button"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {loading ? "पंजीकरण हो रहा है..." : "पंजीकरण करें"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

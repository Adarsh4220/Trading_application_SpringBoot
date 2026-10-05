import { useState } from "react";
import { Shield, KeyRound, Smartphone } from "lucide-react";
import Button from "../components/common/Button";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Security() {
  const { twoFactorEnabled, markTwoFactorEnabled, user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const enable = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await authService.enableTwoFactor();
      markTwoFactorEnabled();
      toast.success(result || "Two-factor authentication enabled");
      setMessage(result);
    } catch (err) {
      toast.error(err.userMessage || "Unable to enable 2FA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Security</h1>
        <p className="mt-1 text-sm text-slate-400">Protect the account signed in as {user?.email || "your user"}.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-card rounded-2xl p-5">
          <Smartphone className="mb-3 text-blue-300" />
          <h2 className="font-semibold">Two-factor authentication</h2>
          <p className="mt-2 text-sm text-slate-400">
            Status: {twoFactorEnabled ? "Enabled" : "Not enabled"}
          </p>
          <Button className="mt-4 w-full" loading={loading} onClick={enable} disabled={twoFactorEnabled}>
            {twoFactorEnabled ? "2FA enabled" : "Enable 2FA"}
          </Button>
          <p className="mt-3 text-xs text-slate-500">
            Disable 2FA is not available on the current backend. Login OTP uses `/auth/verify-login-otp`.
          </p>
        </article>
        <article className="glass-card rounded-2xl p-5">
          <KeyRound className="mb-3 text-violet-300" />
          <h2 className="font-semibold">Password security</h2>
          <p className="mt-2 text-sm text-slate-400">
            Reset your password through the email OTP flow. There is no profile password-update API.
          </p>
        </article>
        <article className="glass-card rounded-2xl p-5">
          <Shield className="mb-3 text-emerald-300" />
          <h2 className="font-semibold">Login security</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sessions use a JWT stored locally as `cryptox_token`. Tokens are never rendered in the UI.
          </p>
        </article>
      </div>
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
    </div>
  );
}

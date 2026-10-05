import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import PasswordField from "../components/common/PasswordField";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { looksLikeJwt } from "../utils/format";
import { USER_KEY } from "../config/apiConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, markTwoFactorEnabled } = useAuth();
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await authService.login({ email, password });
      if (result === "2FA_REQUIRED") {
        markTwoFactorEnabled();
        localStorage.setItem(USER_KEY, JSON.stringify({ email, name: email.split("@")[0] }));
        toast.info("Two-factor authentication required.");
        navigate("/verify-otp", { state: { email, purpose: "login" } });
        return;
      }
      if (looksLikeJwt(result)) {
        login(result, { email });
        navigate("/dashboard");
        return;
      }
      setError(result || "Unable to login.");
    } catch (err) {
      setError(err.userMessage || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your CryptoX account.">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm text-slate-300">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
          />
        </div>
        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-blue-300 hover:underline">
            Forgot Password?
          </Link>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          Login
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-400">
        New to CryptoX?{" "}
        <Link to="/register" className="text-blue-300 hover:underline">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}

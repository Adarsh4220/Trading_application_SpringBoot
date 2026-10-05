import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await authService.forgotPassword(email);
      if (String(result).toLowerCase().includes("sent")) {
        toast.success("OTP sent successfully.");
        navigate("/reset-password", { state: { email } });
        return;
      }
      setError(result || "Unable to send reset OTP.");
    } catch (err) {
      setError(err.userMessage || "Unable to send reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="We’ll send a one-time code to your email.">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label htmlFor="forgot-email" className="mb-2 block text-sm text-slate-300">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          Send OTP
        </Button>
      </form>
      <Link to="/login" className="mt-6 inline-block text-sm text-blue-300 hover:underline">
        Back to login
      </Link>
    </AuthLayout>
  );
}

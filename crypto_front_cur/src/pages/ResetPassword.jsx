import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import PasswordField from "../components/common/PasswordField";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(location.state?.otp || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await authService.resetPassword({
        email,
        otp,
        newPassword: password,
      });
      if (String(result).toLowerCase().includes("success")) {
        toast.success("Password reset successfully.");
        navigate("/login");
        return;
      }
      setError(result || "Unable to reset password.");
    } catch (err) {
      setError(err.userMessage || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter the OTP from your email and a new password.">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label htmlFor="reset-email" className="mb-2 block text-sm text-slate-300">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
          />
        </div>
        <div>
          <label htmlFor="reset-otp" className="mb-2 block text-sm text-slate-300">
            OTP
          </label>
          <input
            id="reset-otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
          />
        </div>
        <PasswordField
          id="reset-password"
          label="New Password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordField
          id="reset-confirm"
          label="Confirm Password"
          value={confirm}
          autoComplete="new-password"
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}

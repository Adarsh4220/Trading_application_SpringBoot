import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { looksLikeJwt } from "../utils/format";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "login";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const setDigit = (index, value) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) inputs.current[index + 1]?.focus();
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    text.split("").forEach((c, i) => {
      next[i] = c;
    });
    setDigits(next);
    inputs.current[Math.min(text.length, 5)]?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is missing. Start from login or forgot password.");
      return;
    }
    const otp = digits.join("");
    if (otp.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (purpose === "login") {
        const result = await authService.verifyLoginOtp({ email, otp });
        if (looksLikeJwt(result)) {
          login(result, { email });
          navigate("/dashboard");
          return;
        }
        setError(result || "OTP verification failed.");
        return;
      }
      const result = await authService.verifyOtp({ email, otp });
      if (String(result).toLowerCase().includes("success")) {
        toast.success("OTP verified successfully.");
        navigate("/reset-password", { state: { email, otp } });
        return;
      }
      setError(result || "OTP verification failed.");
    } catch (err) {
      setError(err.userMessage || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify OTP" subtitle={`Enter the 6-digit code sent to ${email || "your email"}.`}>
      <form className="space-y-5" onSubmit={submit}>
        <div className="flex justify-between gap-2" onPaste={onPaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) {
                  inputs.current[i - 1]?.focus();
                }
              }}
              className="h-12 w-11 rounded-xl border border-white/10 bg-[#151B2B] text-center text-lg sm:w-12"
            />
          ))}
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          Verify
        </Button>
      </form>
    </AuthLayout>
  );
}

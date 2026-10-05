import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import PasswordField from "../components/common/PasswordField";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";
import { USER_KEY } from "../config/apiConfig";

function passwordStrength(password) {
  if (!password || password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Use letters and numbers for a stronger password.";
  }
  return "";
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const strength = passwordStrength(password);
    if (strength) {
      setError(strength);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await authService.register({ name, email, password });
      if (result.toLowerCase().includes("successful")) {
        localStorage.setItem(USER_KEY, JSON.stringify({ name, email }));
        toast.success("Account created. Please login.");
        navigate("/login");
        return;
      }
      setError(result || "Unable to register.");
    } catch (err) {
      setError(err.userMessage || "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your CryptoX account" subtitle="Start with a secure wallet in minutes.">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label htmlFor="reg-name" className="mb-2 block text-sm text-slate-300">
            Name
          </label>
          <input
            id="reg-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
          />
        </div>
        <div>
          <label htmlFor="reg-email" className="mb-2 block text-sm text-slate-300">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
          />
        </div>
        <PasswordField
          id="reg-password"
          label="Password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordField
          id="reg-confirm"
          label="Confirm Password"
          value={confirm}
          autoComplete="new-password"
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-300 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

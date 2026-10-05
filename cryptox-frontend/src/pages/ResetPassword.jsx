import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      const result = response.data;

      if (result === "Password reset successfully") {
        alert("Password reset successfully. Please login.");

        navigate("/login");
        return;
      }

      setError(result);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data ||
        "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center px-4">

        <div className="text-center">

          <h2 className="text-2xl font-bold mb-4">
            Invalid reset session
          </h2>

          <Link
            to="/forgot-password"
            className="text-blue-400 hover:text-blue-300"
          >
            Request a new OTP
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-500">
            CryptoX
          </h1>

          <p className="text-gray-400 mt-2">
            Create a new password
          </p>

        </div>

        {/* Card */}

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-white mb-2">
            Reset Password
          </h2>

          <p className="text-gray-400 text-sm mb-2">
            Enter the OTP sent to:
          </p>

          <p className="text-blue-400 text-sm mb-6">
            {email}
          </p>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleReset}>

            {/* OTP */}

            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-2">
                OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit OTP"
                required
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500"
              />

            </div>

            {/* New Password */}

            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={8}
                required
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* Confirm Password */}

            <div className="mb-6">

              <label className="block text-sm text-gray-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={8}
                required
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* Reset */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>

          <p className="text-center mt-6">

            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-login-otp", {
        email,
        otp,
      });

      const token = response.data;

      if (typeof token === "string" && token.startsWith("ey")) {
        localStorage.setItem("cryptox_token", token);

        navigate("/dashboard");
        return;
      }

      setError(token);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data ||
        "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold mb-4">
            Invalid OTP session
          </h2>

          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300"
          >
            Go back to Login
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
            Secure your account
          </p>

        </div>

        {/* Card */}

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-white mb-2">
            Verify OTP
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            We sent a 6-digit OTP to
          </p>

          <p className="text-blue-400 text-sm mb-6">
            {email}
          </p>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify}>

            <label className="block text-sm text-gray-300 mb-2">
              Enter OTP
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

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Didn't receive the OTP?
          </p>

          <Link
            to="/login"
            className="block text-center text-blue-400 hover:text-blue-300 mt-2"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default VerifyOtp;
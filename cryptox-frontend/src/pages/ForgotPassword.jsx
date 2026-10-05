import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      const result = response.data;

      if (result === "Password reset OTP sent successfully") {
        navigate("/reset-password", {
          state: {
            email,
          },
        });

        return;
      }

      setError(result);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data ||
        "Unable to send reset OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-500">
            CryptoX
          </h1>

          <p className="text-gray-400 mt-2">
            Reset your password
          </p>

        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-white mb-2">
            Forgot Password?
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Enter your registered email and we'll send you an OTP.
          </p>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const result = response.data;

      console.log("Login response:", result);

      if (result === "2FA_REQUIRED") {
        navigate("/verify-otp", {
          state: {
            email: email,
          },
        });

        return;
      }

      if (typeof result === "string" && result.startsWith("ey")) {
        localStorage.setItem("cryptox_token", result);

        navigate("/dashboard");

        return;
      }

      setError(result);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-500">
            CryptoX
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome back to CryptoX
          </p>

        </div>

        {/* Login Card */}

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-white mb-6">
            Login
          </h2>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* Password */}

            <div className="mb-3">

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* Forgot Password */}

            <div className="text-right mb-6">

              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}

          <p className="text-center text-gray-400 mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const result = response.data;

      if (result === "Registration successful") {
        setSuccess("Registration successful! Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      setError(result);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data ||
        "Registration failed. Please try again."
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
            Create your CryptoX account
          </p>

        </div>

        {/* Register Card */}

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-white mb-6">
            Create Account
          </h2>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* Name */}

            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

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

            <div className="mb-6">

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={8}
                required
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Password must be at least 8 characters.
              </p>

            </div>

            {/* Register */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* Login */}

          <p className="text-center text-gray-400 mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;
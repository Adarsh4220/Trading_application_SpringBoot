import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [wallet, setWallet] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [marketData, setMarketData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("cryptox_token");
    navigate("/login");
  };

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          walletResponse,
          portfolioResponse,
          marketResponse,
        ] = await Promise.all([
          api.get("/wallet"),
          api.get("/portfolio"),
          api.get("/crypto/markets"),
        ]);

        setWallet(walletResponse.data);
        setPortfolio(portfolioResponse.data);
        setMarketData(marketResponse.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="border-b border-gray-800 bg-[#0f1420]">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}

          <Link
            to="/dashboard"
            className="text-2xl font-bold text-blue-500"
          >
            CryptoX
          </Link>

          {/* Navigation */}

          <div className="hidden md:flex items-center gap-8">

            <Link
              to="/dashboard"
              className="text-blue-400"
            >
              Dashboard
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white"
            >
              Markets
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white"
            >
              Portfolio
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white"
            >
              Wallet
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white"
            >
              Transactions
            </Link>

          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          MAIN
      ========================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome back to CryptoX
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* =========================
            BALANCE CARDS
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Wallet Balance */}

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-400 text-sm">
              Total Wallet Balance
            </p>

            <h2 className="text-3xl font-bold mt-3">

              {loading
                ? "Loading..."
                : `$${Number(
                    wallet?.balance ?? 0
                  ).toFixed(2)}`}

            </h2>

            <p className="text-green-400 text-sm mt-2">
              Available balance
            </p>

          </div>

          {/* Portfolio */}

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-400 text-sm">
              Crypto Portfolio
            </p>

            <h2 className="text-3xl font-bold mt-3">

              {loading
                ? "Loading..."
                : `$${Number(
                    portfolio?.totalValue ?? 0
                  ).toFixed(2)}`}

            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Current investment value
            </p>

          </div>

          {/* P&L */}

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-400 text-sm">
              Portfolio P&L
            </p>

            <h2 className="text-3xl font-bold mt-3 text-green-400">
              $0.00
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Overall performance
            </p>

          </div>

        </div>

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Portfolio */}

          <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-semibold">
                Your Portfolio
              </h2>

              <Link
                to="/dashboard"
                className="text-blue-400 text-sm"
              >
                View All
              </Link>

            </div>

            {loading ? (

              <div className="text-center py-12 text-gray-400">
                Loading portfolio...
              </div>

            ) : portfolio?.holdings?.length > 0 ? (

              <div className="space-y-3">

                {portfolio.holdings.map((holding) => (

                  <div
                    key={holding.coinId}
                    className="flex items-center justify-between bg-[#0b0f19] border border-gray-800 rounded-xl p-4"
                  >

                    <div>

                      <p className="font-semibold">
                        {holding.coinId}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        Quantity: {holding.quantity}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold">
                        $
                        {Number(
                          holding.currentValue ?? 0
                        ).toFixed(2)}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        Current Value
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center py-12">

                <div className="text-5xl mb-4">
                  📊
                </div>

                <h3 className="text-lg font-semibold">
                  No crypto holdings yet
                </h3>

                <p className="text-gray-400 mt-2">
                  Buy your first cryptocurrency to start
                  building your portfolio.
                </p>

                <button className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
                  Explore Markets
                </button>

              </div>

            )}

          </div>

          {/* Quick Actions */}

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
              Quick Actions
            </h2>

            <div className="space-y-4">

              <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold">
                Buy Crypto
              </button>

              <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-semibold">
                Sell Crypto
              </button>

              <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-semibold">
                Add Money
              </button>

              <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-semibold">
                Withdraw
              </button>

            </div>

          </div>

        </div>

        {/* =========================
            MARKET OVERVIEW
        ========================= */}

        <div className="mt-6 bg-[#111827] border border-gray-800 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-semibold">
              Market Overview
            </h2>

            <span className="text-sm text-gray-500">
              Live market data
            </span>

          </div>

          {/* Loading */}

          {loading ? (

            <div className="text-center py-10 text-gray-400">
              Loading market data...
            </div>

          ) : marketData.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No market data available.
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {marketData.slice(0, 4).map((coin) => (

                <div
                  key={coin.id}
                  className="bg-[#0b0f19] border border-gray-800 rounded-xl p-5"
                >

                  {/* Coin Name */}

                  <div className="flex items-center justify-between">

                    <p className="text-gray-400 text-sm">
                      {coin.name}
                    </p>

                    <span className="text-xs uppercase text-gray-500">
                      {coin.symbol}
                    </span>

                  </div>

                  {/* Price */}

                  <p className="text-xl font-bold mt-3">

                    $
                    {Number(
                      coin.current_price ?? 0
                    ).toLocaleString()}

                  </p>

                  {/* 24h Change */}

                  <p
                    className={`text-sm mt-1 ${
                      Number(
                        coin.price_change_percentage_24h ?? 0
                      ) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >

                    {Number(
                      coin.price_change_percentage_24h ?? 0
                    ).toFixed(2)}

                    % 24h

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* =========================
            RECENT TRANSACTIONS
        ========================= */}

        <div className="mt-6 bg-[#111827] border border-gray-800 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-6">
            Recent Transactions
          </h2>

          <div className="text-center py-10 text-gray-500">
            No transactions yet.
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;
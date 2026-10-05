import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PortfolioCard from "../components/dashboard/PortfolioCard";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import { SkeletonPage } from "../components/common/Skeleton";
import { portfolioService } from "../services/portfolioService";
import { displayName, formatMoney, formatNumber } from "../utils/format";

export default function Portfolio() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await portfolioService.getPortfolio());
    } catch (err) {
      setError(err.userMessage || "Unable to load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <SkeletonPage />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const holdings = data?.holdings || [];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="mt-1 text-sm text-slate-400">Holdings reported by your CryptoX account.</p>
      </div>
      <div className="glass-card rounded-2xl p-5">
        <p className="text-sm text-slate-400">Total Portfolio Value</p>
        <p className="mt-2 text-3xl font-bold">{formatMoney(data?.totalPortfolioValue)}</p>
      </div>
      <div className="glass-card rounded-2xl p-5">
        <h2 className="mb-4 text-lg font-semibold">Allocation</h2>
        <PortfolioCard holdings={holdings} total={data?.totalPortfolioValue} />
      </div>
      {!holdings.length ? (
        <EmptyState
          title="No crypto holdings yet."
          description="Buy your first asset to start building a portfolio."
          actionLabel="Start Trading"
          onAction={() => navigate("/trade")}
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-white/8 md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#151B2B] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Coin</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr
                    key={h.coinId}
                    className="cursor-pointer border-t border-white/5 hover:bg-white/5"
                    onClick={() => navigate(`/markets/${h.coinId}`)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{displayName(h.coinId)}</p>
                      <p className="text-xs uppercase text-slate-400">{h.coinId}</p>
                    </td>
                    <td className="px-4 py-3">{formatNumber(h.quantity, 8)}</td>
                    <td className="px-4 py-3">{formatMoney(h.currentPrice)}</td>
                    <td className="px-4 py-3">{formatMoney(h.currentValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {holdings.map((h) => (
              <button
                key={h.coinId}
                type="button"
                onClick={() => navigate(`/markets/${h.coinId}`)}
                className="glass-card w-full rounded-2xl p-4 text-left"
              >
                <p className="font-semibold">{displayName(h.coinId)}</p>
                <p className="text-xs uppercase text-slate-400">{h.coinId}</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span>Qty {formatNumber(h.quantity, 8)}</span>
                  <span>{formatMoney(h.currentValue)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Price {formatMoney(h.currentPrice)}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BuyForm from "../components/trading/BuyForm";
import SellForm from "../components/trading/SellForm";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { SkeletonPage } from "../components/common/Skeleton";
import { cryptoService } from "../services/cryptoService";
import { walletService } from "../services/walletService";
import { portfolioService } from "../services/portfolioService";
import { tradingService } from "../services/tradingService";
import { useToast } from "../context/ToastContext";
import { formatMoney } from "../utils/format";

export default function Trade() {
  const location = useLocation();
  const toast = useToast();
  const [tab, setTab] = useState("BUY");
  const [coins, setCoins] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    const [markets, w, p] = await Promise.all([
      cryptoService.getMarkets(1, 100),
      walletService.getWallet(),
      portfolioService.getPortfolio(),
    ]);
    setCoins(Array.isArray(markets) ? markets : []);
    setWallet(w);
    setPortfolio(p);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        await refresh();
      } catch (err) {
        if (active) setError(err.userMessage || "Unable to load trading data.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <SkeletonPage />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const preferred = location.state?.coinId;
  const orderedCoins = preferred
    ? [...coins].sort((a, b) => (a.id === preferred ? -1 : b.id === preferred ? 1 : 0))
    : coins;

  return (
    <div className="mx-auto max-w-xl space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Trade</h1>
        <p className="mt-1 text-sm text-slate-400">Wallet {formatMoney(wallet?.balance)}</p>
      </div>
      <div className="grid grid-cols-2 rounded-2xl bg-[#151B2B] p-1">
        {["BUY", "SELL"].map((item) => (
          <button
            key={item}
            type="button"
            className={`min-h-11 rounded-xl text-sm font-semibold ${
              tab === item ? "bg-gradient-to-r from-blue-600 to-violet-600" : ""
            }`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-5">
        {tab === "BUY" ? (
          orderedCoins.length ? (
            <BuyForm
              coins={orderedCoins}
              walletBalance={wallet?.balance}
              loading={busy}
              onBuy={async (payload) => {
                setBusy(true);
                try {
                  await tradingService.buy(payload);
                  toast.success("Crypto purchased successfully");
                  await refresh();
                } catch (err) {
                  toast.error(err.userMessage || err.response?.data || "Buy failed.");
                } finally {
                  setBusy(false);
                }
              }}
            />
          ) : (
            <EmptyState title="No market coins available." description="Markets must load before you can buy." />
          )
        ) : (portfolio?.holdings || []).length ? (
          <SellForm
            holdings={portfolio.holdings}
            coins={coins}
            loading={busy}
            onSell={async (payload) => {
              setBusy(true);
              try {
                await tradingService.sell(payload);
                toast.success("Crypto sold successfully");
                await refresh();
              } catch (err) {
                toast.error(err.userMessage || err.response?.data || "Sell failed.");
              } finally {
                setBusy(false);
              }
            }}
          />
        ) : (
          <EmptyState title="No holdings to sell." description="Buy crypto before opening a sell order." />
        )}
      </div>
    </div>
  );
}

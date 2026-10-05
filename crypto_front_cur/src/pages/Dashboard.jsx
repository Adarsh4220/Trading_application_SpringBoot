import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../components/dashboard/BalanceCard";
import PortfolioCard from "../components/dashboard/PortfolioCard";
import MarketOverview from "../components/dashboard/MarketOverview";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import Button from "../components/common/Button";
import { SkeletonCard, SkeletonChart } from "../components/common/Skeleton";
import { useAuth } from "../context/AuthContext";
import { walletService } from "../services/walletService";
import { portfolioService } from "../services/portfolioService";
import { cryptoService } from "../services/cryptoService";
import { transactionService } from "../services/transactionService";
import { formatMoney, formatNumber, formatPercent } from "../utils/format";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [walletError, setWalletError] = useState("");
  const [portfolioError, setPortfolioError] = useState("");
  const [marketError, setMarketError] = useState("");
  const [txError, setTxError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const [w, p, m, t] = await Promise.allSettled([
        walletService.getWallet(),
        portfolioService.getPortfolio(),
        cryptoService.getMarkets(1, 20),
        transactionService.getTransactions(),
      ]);
      if (!active) return;
      if (w.status === "fulfilled") setWallet(w.value);
      else setWalletError(w.reason?.userMessage || "Unable to load wallet.");
      if (p.status === "fulfilled") setPortfolio(p.value);
      else setPortfolioError(p.reason?.userMessage || "Unable to load portfolio.");
      if (m.status === "fulfilled") setMarkets(Array.isArray(m.value) ? m.value : []);
      else setMarketError(m.reason?.userMessage || "Unable to load markets.");
      if (t.status === "fulfilled") setTransactions(Array.isArray(t.value) ? t.value : []);
      else setTxError(t.reason?.userMessage || "Unable to load transactions.");
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const marketChange =
    markets.length > 0
      ? markets.reduce((sum, c) => sum + (Number(c.price_change_percentage_24h) || 0), 0) / markets.length
      : null;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back 👋 {user?.name || ""}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Here's your crypto portfolio overview. Track your crypto portfolio, markets and transactions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <BalanceCard
              label="Total Wallet Balance"
              value={walletError ? "Unavailable" : formatMoney(wallet?.balance)}
              hint={walletError || (wallet?.walletId ? `Wallet ID ${wallet.walletId}` : "")}
              tone="success"
            />
            <BalanceCard
              label="Portfolio Value"
              value={portfolioError ? "Unavailable" : formatMoney(portfolio?.totalPortfolioValue)}
              hint={portfolioError || ""}
            />
            <BalanceCard
              label="Total Holdings"
              value={portfolioError ? "Unavailable" : formatNumber(portfolio?.holdings?.length || 0, 0)}
            />
            <BalanceCard
              label="24h Market Change"
              value={marketError ? "Unavailable" : formatPercent(marketChange)}
              hint={marketError || "Average across loaded markets"}
              tone={Number(marketChange) >= 0 ? "success" : "warning"}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        <Button onClick={() => navigate("/wallet")}>Add Money</Button>
        <Button variant="secondary" onClick={() => navigate("/trade")}>
          Buy Crypto
        </Button>
        <Button variant="secondary" onClick={() => navigate("/trade")}>
          Sell Crypto
        </Button>
        <Button variant="ghost" onClick={() => navigate("/wallet")}>
          Withdraw
        </Button>
      </div>

      <section className="glass-card rounded-2xl p-5">
        <h2 className="mb-4 text-lg font-semibold">Portfolio allocation</h2>
        {loading ? (
          <SkeletonChart />
        ) : portfolioError ? (
          <p className="text-sm text-red-300">{portfolioError}</p>
        ) : (
          <PortfolioCard holdings={portfolio?.holdings} total={portfolio?.totalPortfolioValue} />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Markets</h2>
          <Button variant="ghost" onClick={() => navigate("/markets")}>
            View all
          </Button>
        </div>
        {marketError ? <p className="text-sm text-red-300">{marketError}</p> : <MarketOverview coins={markets} />}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          <Button variant="ghost" onClick={() => navigate("/transactions")}>
            History
          </Button>
        </div>
        <RecentTransactions transactions={transactions} error={txError} />
      </section>
    </div>
  );
}

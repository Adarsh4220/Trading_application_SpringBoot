import { useEffect, useMemo, useState } from "react";
import CoinCard from "../components/crypto/CoinCard";
import CoinTable from "../components/crypto/CoinTable";
import ErrorState from "../components/common/ErrorState";
import { SkeletonTable } from "../components/common/Skeleton";
import { cryptoService } from "../services/cryptoService";

export default function Markets() {
  const [coins, setCoins] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rank");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await cryptoService.getMarkets(1, 100);
      setCoins(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.userMessage || "Unable to load markets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = coins.filter((c) => {
      if (!q) return true;
      return (
        String(c.name || "").toLowerCase().includes(q) ||
        String(c.symbol || "").toLowerCase().includes(q) ||
        String(c.id || "").toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      if (sort === "price") return Number(b.current_price) - Number(a.current_price);
      if (sort === "change") return Number(b.price_change_percentage_24h) - Number(a.price_change_percentage_24h);
      return (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999);
    });
    return list;
  }, [coins, query, sort]);

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Markets</h1>
        <p className="mt-1 text-sm text-slate-400">Live market data from CryptoX.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="market-search">
          Filter markets
        </label>
        <input
          id="market-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or symbol"
          className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3 sm:max-w-sm"
        />
        <label className="sr-only" htmlFor="market-sort">
          Sort
        </label>
        <select
          id="market-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-12 rounded-xl border border-white/10 bg-[#151B2B] px-3"
        >
          <option value="rank">Rank</option>
          <option value="price">Price</option>
          <option value="change">24h change</option>
        </select>
      </div>
      {loading ? <SkeletonTable /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {!loading && !error ? (
        <>
          <CoinTable coins={filtered} />
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

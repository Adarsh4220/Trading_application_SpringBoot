import { useEffect, useMemo, useState } from "react";
import TransactionList from "../components/transactions/TransactionList";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import { SkeletonTable } from "../components/common/Skeleton";
import { transactionService } from "../services/transactionService";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  { id: "ALL", label: "All" },
  { id: "DEPOSIT", label: "Deposits" },
  { id: "WITHDRAWAL", label: "Withdrawals" },
  { id: "BUY", label: "Buys" },
  { id: "SELL", label: "Sells" },
];

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await transactionService.getTransactions();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.userMessage || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    let list = filter === "ALL" ? items : items.filter((t) => t.type === filter);
    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt).getTime() || 0;
      const db = new Date(b.createdAt).getTime() || 0;
      return sort === "desc" ? db - da : da - db;
    });
    return list;
  }, [items, filter, sort]);

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="mt-1 text-sm text-slate-400">Wallet and trading activity.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`min-h-11 rounded-xl px-3 text-sm ${
              filter === f.id ? "bg-gradient-to-r from-blue-600 to-violet-600" : "bg-[#151B2B]"
            }`}
          >
            {f.label}
          </button>
        ))}
        <select
          aria-label="Sort by date"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="min-h-11 rounded-xl border border-white/10 bg-[#151B2B] px-3 text-sm"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>
      {loading ? <SkeletonTable /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {!loading && !error && visible.length === 0 ? (
        <EmptyState title="No transactions yet." actionLabel="Add Money" onAction={() => navigate("/wallet")} />
      ) : null}
      {!loading && !error && visible.length > 0 ? <TransactionList transactions={visible} /> : null}
    </div>
  );
}

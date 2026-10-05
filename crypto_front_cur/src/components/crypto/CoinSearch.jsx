import { useEffect, useRef, useState } from "react";
import { cryptoService } from "../../services/cryptoService";
import { displayName } from "../../utils/format";

export default function CoinSearch({ placeholder = "Search coins", onSelect, className = "", inputId = "coin-search" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return undefined;
    }
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const data = await cryptoService.searchCoins(q);
        setResults(Array.isArray(data) ? data.slice(0, 8) : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <label className="sr-only" htmlFor={inputId}>
        Search crypto
      </label>
      <input
        id={inputId}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/10 bg-[#151B2B] pl-10 pr-3 text-sm text-white"
      />
      {open ? (
        <ul className="absolute z-40 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-[#111827] p-2 shadow-2xl scrollbar-thin">
          {loading ? <li className="px-3 py-2 text-sm text-slate-400">Searching...</li> : null}
          {!loading && results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-slate-400">No coins found.</li>
          ) : null}
          {results.map((coin) => (
            <li key={coin.id}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                onClick={() => {
                  onSelect?.(coin);
                  setQuery("");
                  setOpen(false);
                }}
              >
                {coin.thumb ? (
                  <img src={coin.thumb} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <span className="h-6 w-6 rounded-full bg-white/10" />
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{displayName(coin.id, coin.name)}</span>
                  <span className="block text-xs uppercase text-slate-400">{coin.symbol}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

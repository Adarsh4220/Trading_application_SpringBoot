import { useNavigate } from "react-router-dom";
import { formatMoney, formatPercent } from "../../utils/format";

export default function CoinCard({ coin }) {
  const navigate = useNavigate();
  const change = Number(coin.price_change_percentage_24h);
  const up = Number.isFinite(change) && change >= 0;

  return (
    <button
      type="button"
      onClick={() => navigate(`/markets/${coin.id}`)}
      className="glass-card w-full rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        {coin.image ? (
          <img src={coin.image} alt="" className="h-10 w-10 rounded-full" />
        ) : (
          <span className="h-10 w-10 rounded-full bg-white/10" />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold">{coin.name || coin.id}</p>
          <p className="text-xs uppercase text-slate-400">{coin.symbol}</p>
        </div>
        {coin.market_cap_rank ? (
          <span className="ml-auto text-xs text-slate-500">#{coin.market_cap_rank}</span>
        ) : null}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-lg font-semibold">{formatMoney(coin.current_price)}</p>
        <p className={`text-sm font-medium ${up ? "text-emerald-400" : "text-red-400"}`}>
          {formatPercent(coin.price_change_percentage_24h)}
          <span className="sr-only">{up ? "up" : "down"}</span>
        </p>
      </div>
    </button>
  );
}

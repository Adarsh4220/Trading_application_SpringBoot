import { useNavigate } from "react-router-dom";
import { formatMoney, formatNumber, formatPercent } from "../../utils/format";

export default function CoinTable({ coins }) {
  const navigate = useNavigate();

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-white/8 md:block">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#151B2B] text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Coin</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">24h</th>
              <th className="px-4 py-3 font-medium">Market cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const change = Number(coin.price_change_percentage_24h);
              const up = Number.isFinite(change) && change >= 0;
              return (
                <tr
                  key={coin.id}
                  className="cursor-pointer border-t border-white/5 hover:bg-white/5"
                  onClick={() => navigate(`/markets/${coin.id}`)}
                >
                  <td className="px-4 py-3 text-slate-500">{coin.market_cap_rank ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {coin.image ? <img src={coin.image} alt="" className="h-7 w-7 rounded-full" /> : null}
                      <div>
                        <p className="font-medium">{coin.name || coin.id}</p>
                        <p className="text-xs uppercase text-slate-400">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatMoney(coin.current_price)}</td>
                  <td className={`px-4 py-3 ${up ? "text-emerald-400" : "text-red-400"}`}>
                    {formatPercent(coin.price_change_percentage_24h)}
                    <span className="sr-only">{up ? "increase" : "decrease"}</span>
                  </td>
                  <td className="px-4 py-3">{formatNumber(coin.market_cap, 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

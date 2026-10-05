import { formatDate, formatMoney, formatNumber } from "../../utils/format";

const BADGE = {
  DEPOSIT: "bg-emerald-500/15 text-emerald-300",
  WITHDRAWAL: "bg-amber-500/15 text-amber-300",
  BUY: "bg-blue-500/15 text-blue-300",
  SELL: "bg-violet-500/15 text-violet-300",
  TRANSFER: "bg-slate-500/15 text-slate-300",
};

export default function TransactionList({ transactions, compact = false }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-white/8 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#151B2B] text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Coin</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-slate-400">{tx.id ?? "—"}</td>
                <td className="px-4 py-3">
                  <TypeBadge type={tx.type} />
                </td>
                <td className="px-4 py-3">{formatMoney(tx.amount)}</td>
                <td className="px-4 py-3 uppercase">{tx.coinId || "—"}</td>
                <td className="px-4 py-3">{formatNumber(tx.cryptoQuantity, 8)}</td>
                <td className="px-4 py-3">{formatMoney(tx.cryptoPrice)}</td>
                <td className="px-4 py-3">{formatDate(tx.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {transactions.map((tx) => (
          <article key={tx.id} className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <TypeBadge type={tx.type} />
              <span className="font-semibold">{formatMoney(tx.amount)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">ID {tx.id ?? "—"}</p>
            <p className="mt-1 text-sm text-slate-300">
              {tx.coinId ? `${tx.coinId} · qty ${formatNumber(tx.cryptoQuantity, 8)}` : "USD wallet"}
            </p>
            {!compact ? (
              <p className="mt-1 text-xs text-slate-500">Price {formatMoney(tx.cryptoPrice)}</p>
            ) : null}
            <p className="mt-2 text-xs text-slate-400">{formatDate(tx.createdAt)}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function TypeBadge({ type }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[type] || BADGE.TRANSFER}`}>
      {type || "UNKNOWN"}
    </span>
  );
}

import { useMemo, useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { displayName, formatMoney, formatNumber } from "../../utils/format";

export default function SellForm({ holdings, coins, onSell, loading }) {
  const [coinId, setCoinId] = useState(holdings[0]?.coinId || "");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const holding = useMemo(
    () => holdings.find((h) => h.coinId === coinId) || holdings[0],
    [holdings, coinId]
  );
  const market = coins.find((c) => c.id === (holding?.coinId || coinId));
  const price = Number(holding?.currentPrice ?? market?.current_price);
  const qty = Number(quantity);
  const estimated = Number.isFinite(price) && Number.isFinite(qty) ? qty * price : 0;

  const validate = () => {
    if (!coinId) return "Select a cryptocurrency.";
    if (!Number.isFinite(qty) || qty <= 0) return "Quantity must be greater than 0.";
    if (holding && qty > Number(holding.quantity)) return "Quantity exceeds your holding.";
    return "";
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const msg = validate();
        if (msg) {
          setError(msg);
          return;
        }
        setError("");
        setConfirmOpen(true);
      }}
    >
      <label className="block text-sm text-slate-300" htmlFor="sell-coin">
        Cryptocurrency
      </label>
      <select
        id="sell-coin"
        value={coinId}
        onChange={(e) => setCoinId(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
      >
        {holdings.map((h) => (
          <option key={h.coinId} value={h.coinId}>
            {displayName(h.coinId, market?.name)} ({formatNumber(h.quantity, 8)})
          </option>
        ))}
      </select>

      <label className="block text-sm text-slate-300" htmlFor="sell-qty">
        Quantity
      </label>
      <input
        id="sell-qty"
        type="number"
        min="0"
        step="any"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
      />

      <div className="rounded-xl bg-[#0B0F19] p-3 text-sm">
        <p className="flex justify-between">
          <span className="text-slate-400">Current price</span>
          <span>{formatMoney(price)}</span>
        </p>
        <p className="mt-2 flex justify-between">
          <span className="text-slate-400">Estimated value</span>
          <span>{formatMoney(estimated)}</span>
        </p>
        <p className="mt-2 flex justify-between">
          <span className="text-slate-400">Available quantity</span>
          <span>{formatNumber(holding?.quantity, 8)}</span>
        </p>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" className="w-full" variant="danger" loading={loading}>
        Sell
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm sell"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={loading}
              onClick={async () => {
                await onSell({ coinId, quantity: qty });
                setConfirmOpen(false);
                setQuantity("");
              }}
            >
              Confirm sell
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-300">
          Sell {formatNumber(qty, 8)} {displayName(coinId)} for about {formatMoney(estimated)}?
        </p>
      </Modal>
    </form>
  );
}

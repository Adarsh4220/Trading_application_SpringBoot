import { useMemo, useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { formatMoney, formatNumber } from "../../utils/format";

export default function BuyForm({ coins, walletBalance, onBuy, loading }) {
  const [coinId, setCoinId] = useState(coins[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selected = useMemo(
    () => coins.find((c) => c.id === coinId) || coins[0],
    [coins, coinId]
  );
  const price = Number(selected?.current_price);
  const spend = Number(amount);
  const qty = Number.isFinite(price) && price > 0 && Number.isFinite(spend) ? spend / price : 0;

  const validate = () => {
    if (!coinId) return "Select a cryptocurrency.";
    if (!Number.isFinite(spend) || spend <= 0) return "Amount must be greater than 0.";
    if (walletBalance !== null && walletBalance !== undefined && spend > Number(walletBalance)) {
      return "Amount exceeds wallet balance.";
    }
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
      <label className="block text-sm text-slate-300" htmlFor="buy-coin">
        Cryptocurrency
      </label>
      <select
        id="buy-coin"
        value={coinId}
        onChange={(e) => setCoinId(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
      >
        {coins.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name} ({String(coin.symbol || "").toUpperCase()})
          </option>
        ))}
      </select>

      <label className="block text-sm text-slate-300" htmlFor="buy-amount">
        Amount (USD)
      </label>
      <input
        id="buy-amount"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
      />

      <div className="rounded-xl bg-[#0B0F19] p-3 text-sm">
        <p className="flex justify-between">
          <span className="text-slate-400">Current price</span>
          <span>{formatMoney(selected?.current_price)}</span>
        </p>
        <p className="mt-2 flex justify-between">
          <span className="text-slate-400">Estimated quantity</span>
          <span>{formatNumber(qty, 8)}</span>
        </p>
        <p className="mt-2 flex justify-between">
          <span className="text-slate-400">Wallet balance</span>
          <span>{formatMoney(walletBalance)}</span>
        </p>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" className="w-full" loading={loading}>
        Buy
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm buy"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              loading={loading}
              onClick={async () => {
                await onBuy({ coinId, amount: spend });
                setConfirmOpen(false);
                setAmount("");
              }}
            >
              Confirm buy
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-300">
          Spend {formatMoney(spend)} to buy {selected?.name || coinId}?
        </p>
      </Modal>
    </form>
  );
}

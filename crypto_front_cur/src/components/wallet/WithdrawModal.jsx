import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { formatMoney } from "../../utils/format";

export default function WithdrawModal({ open, onClose, onSubmit, loading, balance }) {
  const [amount, setAmount] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setAmount("");
    setConfirming(false);
    setError("");
  };

  const next = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    if (balance !== null && balance !== undefined && value > Number(balance)) {
      setError("Amount exceeds available balance.");
      return;
    }
    setError("");
    setConfirming(true);
  };

  const confirm = async () => {
    await onSubmit(Number(amount));
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={confirming ? "Confirm withdrawal" : "Withdraw"}
      footer={
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => (confirming ? setConfirming(false) : onClose())}
          >
            {confirming ? "Back" : "Cancel"}
          </Button>
          {confirming ? (
            <Button variant="danger" className="flex-1" loading={loading} onClick={confirm}>
              Confirm
            </Button>
          ) : (
            <Button className="flex-1" onClick={next}>
              Continue
            </Button>
          )}
        </div>
      }
    >
      {confirming ? (
        <p className="text-sm text-slate-300">
          Withdraw {formatMoney(amount)} from your CryptoX wallet?
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-400">Available: {formatMoney(balance)}</p>
          <label className="mb-2 block text-sm text-slate-300" htmlFor="withdraw-amount">
            Amount (USD)
          </label>
          <input
            id="withdraw-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
          />
        </>
      )}
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </Modal>
  );
}

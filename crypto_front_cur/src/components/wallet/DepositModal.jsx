import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function DepositModal({ open, onClose, onSubmit, loading }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    setError("");
    await onSubmit(value);
    setAmount("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Deposit"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" loading={loading} onClick={submit}>
            Deposit
          </Button>
        </div>
      }
    >
      <label className="mb-2 block text-sm text-slate-300" htmlFor="deposit-amount">
        Amount (USD)
      </label>
      <input
        id="deposit-amount"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3"
      />
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </Modal>
  );
}

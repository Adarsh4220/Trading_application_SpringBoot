import { useEffect, useState } from "react";
import DepositModal from "../components/wallet/DepositModal";
import WithdrawModal from "../components/wallet/WithdrawModal";
import TransactionList from "../components/transactions/TransactionList";
import Button from "../components/common/Button";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { SkeletonPage } from "../components/common/Skeleton";
import { walletService } from "../services/walletService";
import { transactionService } from "../services/transactionService";
import { useToast } from "../context/ToastContext";
import { formatMoney } from "../utils/format";

export default function Wallet() {
  const toast = useToast();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const [w, t] = await Promise.all([
      walletService.getWallet(),
      transactionService.getTransactions(),
    ]);
    setWallet(w);
    setTransactions(Array.isArray(t) ? t : []);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        await refresh();
      } catch (err) {
        if (active) setError(err.userMessage || "Unable to load wallet.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <SkeletonPage />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="mt-1 text-sm text-slate-400">USD cash balance used for trading.</p>
      </div>
      <div className="glass-card rounded-2xl bg-gradient-to-br from-blue-500/15 to-violet-500/10 p-6">
        <p className="text-sm text-slate-400">Available Balance</p>
        <p className="mt-2 text-4xl font-bold">{formatMoney(wallet?.balance)}</p>
        {wallet?.walletId ? <p className="mt-3 text-sm text-slate-400">Wallet ID {wallet.walletId}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => setDepositOpen(true)}>
            Deposit
          </Button>
          <Button className="flex-1" variant="secondary" onClick={() => setWithdrawOpen(true)}>
            Withdraw
          </Button>
        </div>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent transactions</h2>
        {transactions.length ? (
          <TransactionList transactions={transactions.slice(0, 8)} />
        ) : (
          <EmptyState title="No transactions yet." actionLabel="Add Money" onAction={() => setDepositOpen(true)} />
        )}
      </section>

      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        loading={busy}
        onSubmit={async (amount) => {
          setBusy(true);
          try {
            await walletService.deposit(amount);
            toast.success("Deposit successful");
            await refresh();
            setDepositOpen(false);
          } catch (err) {
            toast.error(err.userMessage || err.response?.data || "Deposit failed.");
          } finally {
            setBusy(false);
          }
        }}
      />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        loading={busy}
        balance={wallet?.balance}
        onSubmit={async (amount) => {
          setBusy(true);
          try {
            await walletService.withdraw(amount);
            toast.success("Withdrawal submitted");
            await refresh();
            setWithdrawOpen(false);
          } catch (err) {
            toast.error(err.userMessage || err.response?.data || "Withdrawal failed.");
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}

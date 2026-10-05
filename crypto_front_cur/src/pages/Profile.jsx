import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { walletService } from "../services/walletService";
import { formatMoney, initials } from "../utils/format";
import ErrorState from "../components/common/ErrorState";
import { SkeletonCard } from "../components/common/Skeleton";

export default function Profile() {
  const { user, twoFactorEnabled } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [walletError, setWalletError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await walletService.getWallet();
        if (active) setWallet(data);
      } catch (err) {
        if (active) setWalletError(err.userMessage || "Unable to load wallet.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Account details from your session and wallet API.</p>
      </div>
      <div className="glass-card flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold">
          {initials(user?.name, user?.email)}
        </div>
        <div>
          <p className="text-xl font-semibold">{user?.name || "CryptoX user"}</p>
          <p className="text-sm text-slate-400">{user?.email || "—"}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-card rounded-2xl p-5">
          <p className="text-sm text-slate-400">Name</p>
          <p className="mt-2 font-semibold">{user?.name || "—"}</p>
        </article>
        <article className="glass-card rounded-2xl p-5">
          <p className="text-sm text-slate-400">Email</p>
          <p className="mt-2 break-all font-semibold">{user?.email || "—"}</p>
        </article>
        <article className="glass-card rounded-2xl p-5">
          <p className="text-sm text-slate-400">2FA status</p>
          <p className="mt-2 font-semibold">{twoFactorEnabled ? "Enabled" : "Not enabled"}</p>
        </article>
      </div>
      {loading ? (
        <SkeletonCard className="h-32" />
      ) : walletError ? (
        <ErrorState message={walletError} />
      ) : (
        <article className="glass-card rounded-2xl p-5">
          <p className="text-sm text-slate-400">Wallet</p>
          <p className="mt-2 text-2xl font-bold">{formatMoney(wallet?.balance)}</p>
          {wallet?.walletId ? <p className="mt-2 text-sm text-slate-400">Wallet ID {wallet.walletId}</p> : null}
          <p className="mt-3 text-xs text-slate-500">
            Profile editing APIs are not exposed by the backend, so this page is read-only.
          </p>
        </article>
      )}
    </div>
  );
}

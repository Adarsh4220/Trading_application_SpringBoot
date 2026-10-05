import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";
import CoinSearch from "../crypto/CoinSearch";

export default function Header({ onMenu }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifyOpen, setNotifyOpen] = useState(false);

  return (
    <header className="relative sticky top-0 z-30 border-b border-white/10 bg-[#0B0F19]/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button
          type="button"
          className="touch-target inline-flex items-center justify-center rounded-xl border border-white/10 lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold">
            CX
          </div>
          <span className="font-semibold">CryptoX</span>
        </div>

        <div className="hidden min-w-0 flex-1 lg:block">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500" size={16} />
            <CoinSearch
              inputId="desktop-coin-search"
              placeholder="Search crypto"
              onSelect={(coin) => navigate(`/markets/${coin.id}`)}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="touch-target relative inline-flex items-center justify-center rounded-xl border border-white/10"
            aria-label="Notifications"
            onClick={() => setNotifyOpen((v) => !v)}
          >
            <Bell size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="hidden items-center gap-2 rounded-xl border border-white/10 px-2 py-1.5 sm:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold">
              {initials(user?.name, user?.email)}
            </span>
            <span className="hidden text-left lg:block">
              <span className="block text-xs font-semibold">{user?.name || "CryptoX user"}</span>
              <span className="block max-w-[10rem] truncate text-[11px] text-slate-400">
                {user?.email || ""}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-2 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500" size={16} />
          <CoinSearch
            inputId="mobile-coin-search"
            placeholder="Search crypto"
            onSelect={(coin) => navigate(`/markets/${coin.id}`)}
          />
        </div>
      </div>

      {notifyOpen ? (
        <div className="absolute right-4 mt-2 w-[min(100%-2rem,20rem)] rounded-2xl border border-white/10 bg-[#111827] p-4 text-sm text-slate-400 shadow-xl">
          No new notifications.
        </div>
      ) : null}
    </header>
  );
}

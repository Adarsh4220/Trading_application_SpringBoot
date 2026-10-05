import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  ArrowLeftRight,
  Wallet,
  Receipt,
  Bot,
  Shield,
  UserRound,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/markets", label: "Markets", icon: LineChart },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/trade", label: "Trade", icon: ArrowLeftRight },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/security", label: "Security", icon: Shield },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col border-r border-white/8 bg-[#0B0F19] transition-transform duration-200 lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 font-bold">
              CX
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">CryptoX</p>
              <p className="text-xs text-slate-400">Premium exchange</p>
            </div>
          </div>
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-xl lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin" aria-label="Main">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/80 to-violet-600/80 text-white"
                      : "text-slate-300 hover:bg-white/5"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/8 p-3">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            <Settings size={18} />
            Settings
          </NavLink>
          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

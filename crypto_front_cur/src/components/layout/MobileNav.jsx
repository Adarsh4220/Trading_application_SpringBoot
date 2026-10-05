import { NavLink } from "react-router-dom";
import { LayoutDashboard, LineChart, ArrowLeftRight, Wallet, Briefcase } from "lucide-react";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/markets", label: "Markets", icon: LineChart },
  { to: "/trade", label: "Trade", icon: ArrowLeftRight },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/portfolio", label: "Holdings", icon: Briefcase },
];

export default function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[#0B0F19]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Mobile"
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] ${
                  isActive ? "text-blue-300" : "text-slate-400"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

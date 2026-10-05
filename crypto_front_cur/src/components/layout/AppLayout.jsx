import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] lg:flex">
      <Sidebar open={open} onClose={() => setOpen(false)} onLogout={handleLogout} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 overflow-x-hidden px-4 pb-24 pt-4 lg:px-6 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

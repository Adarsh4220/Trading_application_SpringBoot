import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute, { GuestRoute } from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { SkeletonPage } from "./components/common/Skeleton";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Markets = lazy(() => import("./pages/Markets"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Trade = lazy(() => import("./pages/Trade"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Transactions = lazy(() => import("./pages/Transactions"));
const AiAssistant = lazy(() => import("./pages/AiAssistant"));
const Security = lazy(() => import("./pages/Security"));
const Profile = lazy(() => import("./pages/Profile"));
const CoinDetails = lazy(() => import("./components/crypto/CoinDetails"));

function Fallback() {
  return (
    <div className="p-6">
      <SkeletonPage />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/markets/:coinId" element={<CoinDetails />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/trade" element={<Trade />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/ai-assistant" element={<AiAssistant />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

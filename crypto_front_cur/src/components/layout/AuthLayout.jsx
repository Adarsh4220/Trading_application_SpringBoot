export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-[#0B0F19] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#111827] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.2),transparent_35%)]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 font-bold">
              CX
            </div>
            <span className="text-xl font-bold">CryptoX</span>
          </div>
          <h2 className="mt-16 max-w-md text-4xl font-bold leading-tight">
            Trade digital assets with a premium, private-market feel.
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Wallet, portfolio, live markets and secure authentication — built around your existing CryptoX backend.
          </p>
        </div>
        <p className="relative text-sm text-slate-500">Secure session · JWT · 2FA ready</p>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold">
              CX
            </div>
            <span className="font-bold">CryptoX</span>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

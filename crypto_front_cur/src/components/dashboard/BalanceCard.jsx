export default function BalanceCard({ label, value, hint, tone = "default" }) {
  const tones = {
    default: "from-blue-500/20 to-violet-500/10",
    success: "from-emerald-500/20 to-cyan-500/10",
    warning: "from-amber-500/15 to-orange-500/10",
  };

  return (
    <article className={`glass-card overflow-hidden rounded-2xl bg-gradient-to-br ${tones[tone]} p-5`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-400">{hint}</p> : null}
    </article>
  );
}

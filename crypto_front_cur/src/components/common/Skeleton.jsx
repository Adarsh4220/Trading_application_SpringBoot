export function SkeletonCard({ className = "" }) {
  return (
    <div className={`glass-card h-28 animate-pulse rounded-2xl ${className}`}>
      <div className="h-full rounded-2xl bg-white/5" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-card space-y-3 rounded-2xl p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return <div className="glass-card h-64 animate-pulse rounded-2xl bg-white/5" />;
}

export function SkeletonPage() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonChart />
      <SkeletonTable />
    </div>
  );
}

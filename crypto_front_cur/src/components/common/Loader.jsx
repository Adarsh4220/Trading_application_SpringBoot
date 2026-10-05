export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-slate-400" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />
      <span>{label}</span>
    </div>
  );
}

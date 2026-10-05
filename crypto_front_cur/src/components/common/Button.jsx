export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  ...props
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF] text-white hover:opacity-95",
    secondary:
      "bg-[#151B2B] text-slate-100 border border-white/10 hover:border-white/20",
    danger: "bg-red-600/90 text-white hover:bg-red-600",
    ghost: "bg-transparent text-slate-200 hover:bg-white/5",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`touch-target inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant] || styles.primary} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

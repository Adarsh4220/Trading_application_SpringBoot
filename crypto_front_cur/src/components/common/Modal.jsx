import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl slide-up"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="touch-target inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </div>
  );
}

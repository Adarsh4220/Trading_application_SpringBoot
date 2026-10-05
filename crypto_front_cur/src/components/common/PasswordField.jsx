import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordField({ id, label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-white/10 bg-[#151B2B] px-3 pr-12"
        />
        <button
          type="button"
          className="touch-target absolute top-0 right-0 inline-flex items-center justify-center text-slate-400"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

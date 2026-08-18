export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows,
  disabled = false,
  min,
  max,
  step,
  className = "",
  helperText,
  suffix,
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {rows ? (
          <textarea
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-500 ${
              error
                ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:border-rose-500 focus:ring-rose-200"
                : "border-slate-200 bg-slate-50/60 text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-emerald-100 hover:border-slate-300"
            }`}
          />
        ) : (
          <div className="relative flex items-center">
            <input
              id={name}
              name={name}
              type={type}
              value={value ?? ""}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-500 ${
                suffix ? "pr-12" : ""
              } ${
                error
                  ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-200 bg-slate-50/60 text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-emerald-100 hover:border-slate-300"
              }`}
            />
            {suffix && (
              <span className="absolute right-3 text-xs font-semibold text-slate-400 select-none">
                {suffix}
              </span>
            )}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-600 animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

import { AlertCircle } from "lucide-react";

export default function EmptyState({
  title = "Belum Ada Data",
  description = "Silakan lengkapi tahapan sebelumnya terlebih dahulu.",
  action,
  icon: Icon = AlertCircle,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/70 p-8 text-center sm:p-12 shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-500 leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

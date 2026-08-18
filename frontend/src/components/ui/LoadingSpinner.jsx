import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "Memuat data...", size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`animate-spin text-emerald-600 ${sizeClasses[size] || sizeClasses.md}`} />
      {text && <p className="text-xs font-medium text-slate-500">{text}</p>}
    </div>
  );
}

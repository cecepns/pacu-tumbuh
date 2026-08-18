import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  confirmText = "Ya, Hapus Data",
  cancelText = "Batal",
  loading = false,
  isDanger = true,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-4 ${
            isDanger ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
          }`}
        >
          <AlertTriangle className="h-7 w-7" />
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">{message}</p>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white transition ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400"
                : "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

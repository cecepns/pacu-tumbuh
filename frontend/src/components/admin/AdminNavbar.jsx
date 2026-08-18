import { Menu, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminNavbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-base font-bold text-slate-800 hidden sm:block">
          Sistem Informasi Deteksi Tumbuh Kembang & Gizi
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 rounded-full bg-slate-100 py-1.5 pl-3 pr-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.nama || "Admin Nakes"}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Keluar"
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

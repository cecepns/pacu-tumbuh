import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Heart, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/ui/FormField";
import { APP_INFO } from "@/data/content";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Username dan password wajib diisi");
      return;
    }

    setLoading(true);
    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      toast.success("Login berhasil! Selamat datang di Panel Admin PACU TUMBUH.");
      navigate("/admin");
    } else {
      toast.error(res.message || "Username atau password salah");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            PACU TUMBUH
          </span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Portal Tenaga Kesehatan & Admin RS
        </h2>
        <p className="text-xs text-slate-400">
          {APP_INFO.institution}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-md border border-white/20 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Login kredensial nakes / admin RS untuk mengelola rekap data skrining.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Username Admin"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-60"
              >
                <Lock className="h-4 w-4" />
                <span>{loading ? "Memproses Autentikasi..." : "Masuk ke Panel Admin"}</span>
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition inline-flex items-center gap-1"
            >
              <span>← Kembali ke Halaman Utama Publik</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

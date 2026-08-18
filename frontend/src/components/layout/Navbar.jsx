import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  Home,
  Info,
  UserCheck,
  MessageSquare,
  Activity,
  Apple,
  FileCheck2,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Beranda", path: "/", icon: Home },
    { name: "Tentang", path: "/tentang", icon: Info },
    { name: "Profil & Riwayat", path: "/profil-riwayat", icon: UserCheck },
    { name: "Komunikasi", path: "/skrining-komunikasi", icon: MessageSquare },
    { name: "Motorik", path: "/skrining-motorik", icon: Activity },
    { name: "Status Gizi", path: "/skrining-gizi", icon: Apple },
    { name: "Evaluasi", path: "/evaluasi", icon: FileCheck2 },
    { name: "Kontak", path: "/kontak", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition duration-200">
            <Heart className="h-6 w-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-800 to-teal-600 bg-clip-text text-transparent">
                PACU TUMBUH
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 tracking-wide">
                RSUD KL
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              RSUD Kebayoran Lama
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-emerald-700"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Nakes / Admin</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex xl:hidden items-center justify-center rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-emerald-600 text-white font-semibold shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Portal Tenaga Kesehatan / Admin RS</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

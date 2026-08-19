import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoImg from "@/assets/logo.jpeg";
import {
  Menu,
  X,
  Home,
  Info,
  UserCheck,
  MessageSquare,
  Activity,
  Apple,
  FileCheck2,
  PhoneCall,
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
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={logoImg}
            alt="Logo RSUD Kebayoran Lama"
            className="h-16 w-auto sm:h-20 object-contain rounded-xl bg-white group-hover:scale-105 transition duration-200 shrink-0"
          />
          <div className="shrink-0">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-800 to-teal-600 bg-clip-text text-transparent">
                PACU TUMBUH
              </span>
              {/* <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 tracking-wide shrink-0">
                RSUD KL
              </span> */}
            </div>
            {/* <p className="text-[11px] font-medium text-slate-500 hidden sm:block whitespace-nowrap">
              RSUD Kebayoran Lama
            </p> */}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 xl:px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-emerald-700"
                  }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Toggle Button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-medium transition ${isActive
                    ? "bg-emerald-600 text-white font-semibold shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-emerald-600"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

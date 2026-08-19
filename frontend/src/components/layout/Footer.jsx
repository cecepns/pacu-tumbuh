import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Mail, Shield, ArrowRight } from "lucide-react";
import { APP_INFO, CONTACT_INFO } from "@/data/content";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-emerald-900">
                  {APP_INFO.name}
                </span>
                <p className="text-xs text-slate-500 font-medium">{APP_INFO.institution}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              {APP_INFO.longName} — Media digital inovatif pemantauan dini tumbuh kembang dan gizi balita.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg p-2">
              <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Data Dijamin Aman & Rahasia</span>
            </div>
          </div>

          {/* Col 2: Alur Skrining */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">Menu Skrining</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/profil-riwayat" className="hover:text-emerald-600 flex items-center gap-1.5 transition">
                  <ArrowRight className="h-3 w-3 text-emerald-500" />
                  Profil & Riwayat Anak
                </Link>
              </li>
              <li>
                <Link to="/skrining-komunikasi" className="hover:text-emerald-600 flex items-center gap-1.5 transition">
                  <ArrowRight className="h-3 w-3 text-emerald-500" />
                  Skrining Komunikasi
                </Link>
              </li>
              <li>
                <Link to="/skrining-motorik" className="hover:text-emerald-600 flex items-center gap-1.5 transition">
                  <ArrowRight className="h-3 w-3 text-emerald-500" />
                  Skrining Motorik
                </Link>
              </li>
              <li>
                <Link to="/skrining-gizi" className="hover:text-emerald-600 flex items-center gap-1.5 transition">
                  <ArrowRight className="h-3 w-3 text-emerald-500" />
                  Skrining Status Gizi
                </Link>
              </li>
              <li>
                <Link to="/evaluasi" className="hover:text-emerald-600 flex items-center gap-1.5 transition">
                  <ArrowRight className="h-3 w-3 text-emerald-500" />
                  Evaluasi & Unduh Materi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Informasi & Edukasi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">Informasi</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tentang" className="hover:text-emerald-600 transition">
                  Tentang Aplikasi & Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-emerald-600 transition">
                  Jadwal Poli & Konsultasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Layanan RS */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">{CONTACT_INFO.rs_name}</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {APP_INFO.name} — {APP_INFO.institution}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

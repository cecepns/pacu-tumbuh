import { Link } from "react-router-dom";
import {
  Info,
  Shield,
  Heart,
  Target,
  Sparkles,
  ArrowRight,
  Lock,
  Building,
  Users,
} from "lucide-react";
import { APP_INFO } from "@/data/content";

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
          <Info className="h-7 w-7" />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
            Tentang Aplikasi & Disclaimer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            PACU TUMBUH
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {APP_INFO.longName} — {APP_INFO.institution}
          </p>
        </div>
      </div>

      {/* Main Narrative Card */}
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm leading-relaxed text-slate-700 text-sm sm:text-base">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-base pb-2 border-b border-slate-100">
          <Sparkles className="h-5 w-5" />
          <span>Latar Belakang Inovasi Digital</span>
        </div>

        <p className="text-justify leading-relaxed">
          <strong>PACU TUMBUH (Pemantauan Akurat Cakupan Utuh Tumbuh Kembang dan Gizi Anak)</strong> merupakan media digital yang dirancang untuk membantu orang tua dan tenaga kesehatan dalam melakukan deteksi dini, pemantauan, serta evaluasi pertumbuhan, perkembangan, dan status gizi anak secara cepat, mudah, akurat, dan sesuai dengan tahapan usianya. Sistem ini menyediakan formulir deteksi dini, pemantauan berkala, hasil evaluasi otomatis, serta rekomendasi tindak lanjut sebagai dasar pengambilan keputusan dalam pelayanan kesehatan anak.
        </p>

        <p className="text-justify leading-relaxed">
          Melalui PACU TUMBUH, risiko gangguan pertumbuhan, keterlambatan perkembangan, dan permasalahan status gizi dapat diidentifikasi sejak dini sehingga intervensi dapat dilakukan secara lebih cepat, tepat, dan komprehensif.
        </p>

        <p className="text-justify leading-relaxed">
          Inovasi ini bertujuan meningkatkan pemahaman serta partisipasi orang tua dalam memantau tumbuh kembang anak secara rutin, sekaligus mendukung tenaga kesehatan dalam memberikan pelayanan yang terintegrasi, akurat, dan berbasis digital untuk mewujudkan anak yang sehat, bertumbuh optimal, dan berkembang sesuai tahapan usianya.
        </p>
      </div>

      {/* Disclaimer & Privacy Box */}
      <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-emerald-900 font-bold text-base sm:text-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <span>Kalimat Disclaimer & Jaminan Kerahasiaan Data</span>
        </div>

        <div className="rounded-2xl bg-white p-5 text-xs sm:text-sm text-slate-700 leading-relaxed border border-emerald-100 shadow-inner">
          <p className="italic font-medium text-slate-800">
            "{APP_INFO.disclaimer}"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-800 pt-1">
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span>Enkripsi Standar Medis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building className="h-4 w-4 text-emerald-600" />
            <span>Khusus Pelayanan RSUD Kebayoran Lama</span>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            01
          </div>
          <h4 className="font-bold text-sm text-slate-800">Deteksi Dini Komprehensif</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menjangkau aspek komunikasi, motorik kasar & halus, serta status gizi secara terpadu.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
            02
          </div>
          <h4 className="font-bold text-sm text-slate-800">Standar Medis Akurat</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mengacu pada instrumen skrining Kemenkes RI dan kurva pertumbuhan standar WHO.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 font-bold text-xs">
            03
          </div>
          <h4 className="font-bold text-sm text-slate-800">Materi Edukasi Langsung</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dilengkapi flyer ide stimulasi, bermain edukatif, dan resep gizi tinggi kalori.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-slate-900 p-6 sm:p-8 text-white">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-lg">Siap Memantau Tumbuh Kembang Buah Hati?</h3>
          <p className="text-xs text-slate-400">
            Hanya butuh 3–5 menit untuk mengisi data awal anak.
          </p>
        </div>
        <Link
          to="/profil-riwayat"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-600 transition shrink-0"
        >
          <span>Mulai Isi Profil</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

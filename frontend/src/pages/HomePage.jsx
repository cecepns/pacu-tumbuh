import { Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  Activity,
  Apple,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  BookOpen,
  Info,
  Clock,
} from "lucide-react";
import { APP_INFO } from "@/data/content";

export default function HomePage() {
  const steps = [
    {
      number: "01",
      title: "Isi Profil & Riwayat Anak",
      desc: "Lengkapi data identitas anak, tanggal lahir, dan riwayat kesehatan sejak dalam kandungan hingga pasca lahir.",
      icon: Heart,
      link: "/profil-riwayat",
      color: "bg-rose-500",
    },
    {
      number: "02",
      title: "Skrining 3 Aspek Tumbuh Kembang",
      desc: "Jawab ceklis kemampuan komunikasi, motorik kasar-halus, dan pengukuran status gizi sesuai tahapan usia.",
      icon: Activity,
      link: "/skrining-komunikasi",
      color: "bg-emerald-500",
    },
    {
      number: "03",
      title: "Evaluasi & Flyer Stimulasi",
      desc: "Dapatkan analisis otomatis, saran medis, serta akses flyer stimulasi, ide bermain, dan resep gizi seimbang.",
      icon: FileCheck2,
      link: "/evaluasi",
      color: "bg-teal-500",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Skrining Komunikasi",
      desc: "Deteksi dini kemampuan bahasa reseptif, ekspresif, dan interaksi sosial batita usia 0–36 bulan.",
      link: "/skrining-komunikasi",
      badge: "Tahapan Usia",
    },
    {
      icon: Activity,
      title: "Skrining Motorik",
      desc: "Pemantauan motorik kasar dan halus secara sistematis untuk memastikan koordinasi gerak optimal.",
      link: "/skrining-motorik",
      badge: "Kasar & Halus",
    },
    {
      icon: Apple,
      title: "Skrining Status Gizi",
      desc: "Kalkulasi otomatis Z-Score BB/U, TB/U, BB/TB, dan LK/U standar Kemenkes & WHO.",
      link: "/skrining-gizi",
      badge: "Standar WHO",
    },
    {
      icon: BookOpen,
      title: "Materi Edukasi & Flyer",
      desc: "Akses flyer ide stimulasi, ide bermain kreatif di rumah, dan resep makanan tinggi kalori untuk balita.",
      link: "/evaluasi",
      badge: "Google Drive",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 pt-12 lg:pt-20 lg:pb-28">
        {/* Decorative background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-72 w-72 sm:w-[600px] rounded-full bg-emerald-200/40 blur-3xl -z-10" />
        <div className="absolute top-40 right-10 h-56 w-56 rounded-full bg-teal-200/30 blur-2xl -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-1.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
              <span className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                Inovasi Digital Layanan Anak — RSUD Kebayoran Lama
              </span>
            </div>

            {/* Title */}
            <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Pemantauan Akurat Cakupan Utuh{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
                Tumbuh Kembang & Gizi Anak
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              Media deteksi dini mandiri untuk orang tua dan tenaga kesehatan dalam memantau kemampuan komunikasi, motorik, serta status gizi balita secara cepat, terstruktur, dan berbasis standar medis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/profil-riwayat"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:scale-[1.02]"
              >
                <span>Mulai Skrining Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/tentang"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400"
              >
                <Info className="h-4 w-4 text-slate-500" />
                <span>Tentang & Disclaimer</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Sesuai Tahapan Usia (0–36 Bulan)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Kerahasiaan Data Terjamin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Hasil Evaluasi Instan & Otomatis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      {/* <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Alur Pemantauan
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            3 Langkah Mudah Memantau Buah Hati
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-7 shadow-sm hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200">{step.number}</span>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.color} text-white shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-500">{step.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={step.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 group"
                  >
                    <span>Mulai Langkah {step.number}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section> */}

      {/* 4 CORE SCREENING MODULES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl space-y-3 mb-10">
            <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
              Cakupan Pemeriksaan Terintegrasi
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Deteksi Menyeluruh Tumbuh Kembang
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              PACU TUMBUH mengintegrasikan instrumen klinis perkembangan komunikasi, koordinasi motorik, dan penilaian status antropometri gizi dalam satu platform yang mudah digunakan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={i}
                  to={feat.link}
                  className="group flex flex-col justify-between rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/10 hover:bg-white/15 hover:border-emerald-400/40 transition duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        {feat.badge}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-white mb-1.5 group-hover:text-emerald-300 transition">
                      {feat.title}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:underline">
                    <span>Akses Form</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK CONSULTATION & RSUD SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              <span>Komitmen Pelayanan Prima</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Didukung oleh Tim Medis & Poli Anak RSUD Kebayoran Lama
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Jika hasil skrining menunjukkan indikasi perlunya stimulasi intensif atau konsultasi lebih lanjut, orang tua dapat langsung terhubung dengan Poli Anak RSUD Kebayoran Lama untuk evaluasi dokter spesialis anak, fisioterapi, dan terapi wicara.
            </p>
            <div className="pt-2">
              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
              >
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                <span>Lihat Informasi Kontak & Jadwal Poli</span>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Pusat Bantuan Cepat
              </span>
              <h4 className="text-xl font-bold">Konsultasi WhatsApp</h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Punya pertanyaan seputar cara pengisian form atau hasil skrining? Hubungi narahubung kami secara langsung.
              </p>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/6281117032345?text=Halo%20Admin%20PACU%20TUMBUH%20RSUD%20Kebayoran%20Lama,%20saya%20ingin%20konsultasi%20tumbuh%20kembang%20anak"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-emerald-900 shadow-md hover:bg-emerald-50 transition"
              >
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span>Chat WhatsApp Poli Anak</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

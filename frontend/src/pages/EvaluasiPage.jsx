import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FileCheck2,
  MessageSquare,
  Activity,
  Apple,
  Lightbulb,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Printer,
  Download,
  Share2,
  Heart,
  Baby,
  PhoneCall,
  BookOpen,
  Gamepad2,
  Utensils,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useScreening } from "@/context/ScreeningContext";
import { settingsService } from "@/services/settingsService";
import { AGE_GROUPS } from "@/data/communicationChecklist";
import { APP_INFO } from "@/data/content";

export default function EvaluasiPage() {
  const { session } = useScreening();
  const [settings, setSettings] = useState(null);

  const profile = session.profile;
  const comm = session.communicationResult;
  const motor = session.motorResult;
  const nutri = session.nutritionResult;

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await settingsService.getSettings();
        setSettings(res.data);
      } catch {
        // Fallback default
        setSettings({
          rs_name: "RSUD Kebayoran Lama",
          rs_whatsapp: "6281234567890",
          drive_flyer_stimulasi_0_6: "https://drive.google.com",
          drive_flyer_stimulasi_7_12: "https://drive.google.com",
          drive_flyer_stimulasi_13_18: "https://drive.google.com",
          drive_flyer_stimulasi_19_24: "https://drive.google.com",
          drive_flyer_stimulasi_25_30: "https://drive.google.com",
          drive_flyer_stimulasi_31_36: "https://drive.google.com",
          drive_flyer_ide_bermain: "https://drive.google.com",
          drive_flyer_resep_tinggi_kalori: "https://drive.google.com",
        });
      }
    }
    loadSettings();
  }, []);

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Belum Ada Data Skrining"
          description="Lengkapi profil dan lakukan skrining tumbuh kembang anak untuk melihat rangkuman evaluasi terpadu."
          action={
            <Link
              to="/profil-riwayat"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <span>Mulai Deteksi Dini</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Hasil Deteksi Tumbuh Kembang - ${profile.nama_lengkap}`,
          text: `Rangkuman hasil skrining PACU TUMBUH RSUD Kebayoran Lama untuk ${profile.nama_lengkap}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan hasil evaluasi disalin ke clipboard!");
    }
  };

  // Age group & drive link determination
  const ageGroupKey = profile.kelompok_usia || "0-6";
  const driveStimulasiKey = `drive_flyer_stimulasi_${ageGroupKey.replace("-", "_")}`;
  const flyerStimulasiUrl = settings?.[driveStimulasiKey] || "https://drive.google.com";
  const flyerBermainUrl = settings?.drive_flyer_ide_bermain || "https://drive.google.com";
  const flyerResepUrl = settings?.drive_flyer_resep_tinggi_kalori || "https://drive.google.com";

  // Overall status evaluation
  const hasCommIssue = comm && comm.score < 80;
  const hasMotorIssue = motor && motor.score < 80;
  const hasNutriIssue = nutri && (nutri.statusColor === "red" || nutri.statusColor === "yellow");

  const isAllNormal = !hasCommIssue && !hasMotorIssue && !hasNutriIssue;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <FileCheck2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Rangkuman Terpadu
            </span>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Evaluasi Tumbuh Kembang & Gizi
            </h1>
            <p className="text-xs text-slate-500">
              {APP_INFO.institution} — PACU TUMBUH
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Cetak PDF</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Share2 className="h-4 w-4 text-slate-500" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Profil Anak Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-slate-100 pb-2">
          <Baby className="h-4 w-4 text-emerald-600" />
          <span>Informasi Identitas Pasien Anak</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Nama Lengkap</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{profile.nama_lengkap}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Nama Panggilan</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{profile.nama_panggilan}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Tanggal Lahir / Usia</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">
              {profile.tanggal_lahir?.split("T")[0]} ({profile.usia_bulan} Bulan)
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Orang Tua / Wali</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{profile.nama_orang_tua}</p>
          </div>
        </div>

        {profile.keluhan_ortu && (
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
            <span className="font-bold text-slate-700">Keluhan Awal:</span> {profile.keluhan_ortu}
          </div>
        )}
      </div>

      {/* Overall Summary Banner */}
      <div
        className={`rounded-3xl border-2 p-6 sm:p-8 space-y-3 ${
          isAllNormal
            ? "border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-teal-50"
            : "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-rose-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
            Sintesis Klinis Terpadu
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {isAllNormal
            ? "Tumbuh Kembang & Status Gizi Optimal Sesuai Tahapan Usia"
            : "Terdapat Aspek Perkembangan / Gizi yang Memerlukan Perhatian & Stimulasi Khusus"}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isAllNormal
            ? "Selamat! Ananda menunjukkan milestone komunikasi, motorik, dan parameter pertumbuhan yang baik. Pertahankan pola asuh responsif, stimulasi harian, dan nutrisi gizi seimbang."
            : "Berdasarkan penilaian 3 aspek skrining, disarankan untuk memberikan stimulasi yang lebih terarah di rumah sesuai panduan flyer serta berkonsultasi dengan Poli Anak RSUD Kebayoran Lama."}
        </p>
      </div>

      {/* 3 PILAR HASIL SKRINING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Komunikasi */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold text-slate-400">01. KOMUNIKASI</span>
            </div>

            {comm ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{comm.score}%</span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    ({comm.checked_items}/{comm.total_items} butir)
                  </span>
                </div>
                <span
                  className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                    comm.score >= 80
                      ? "bg-emerald-100 text-emerald-800"
                      : comm.score >= 50
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {comm.status}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {comm.rekomendasi_stimulasi}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-400">Belum diskrining</p>
                <Link
                  to="/skrining-komunikasi"
                  className="inline-block text-xs font-bold text-emerald-600 hover:underline"
                >
                  Mulai Skrining →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 2. Motorik */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold text-slate-400">02. MOTORIK</span>
            </div>

            {motor ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{motor.score}%</span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    ({motor.checked_items}/{motor.total_items} butir)
                  </span>
                </div>
                <span
                  className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                    motor.score >= 80
                      ? "bg-emerald-100 text-emerald-800"
                      : motor.score >= 50
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {motor.status}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {motor.rekomendasi_stimulasi}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-400">Belum diskrining</p>
                <Link
                  to="/skrining-motorik"
                  className="inline-block text-xs font-bold text-teal-600 hover:underline"
                >
                  Mulai Skrining →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. Status Gizi */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Apple className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold text-slate-400">03. STATUS GIZI</span>
            </div>

            {nutri ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900">
                    BB: {nutri.bb_sekarang_gram ? nutri.bb_sekarang_gram / 1000 : nutri.bbKg} kg
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    TB: {nutri.tb_cm || nutri.tbCm} cm
                  </span>
                </div>
                <span
                  className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                    nutri.statusColor === "green"
                      ? "bg-emerald-100 text-emerald-800"
                      : nutri.statusColor === "yellow"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {nutri.status_bbtb || nutri.statusBBTB || nutri.status_keseluruhan}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-3">
                  {nutri.rekomendasi_gizi || nutri.rekomendasiGizi}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-400">Belum diskrining</p>
                <Link
                  to="/skrining-gizi"
                  className="inline-block text-xs font-bold text-amber-600 hover:underline"
                >
                  Mulai Skrining →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION GOOGLE DRIVE FLYER & MATERI EDUKASI */}
      <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Materi Edukasi & Flyer Terintegrasi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold">
            Akses Flyer Panduan Resmi RSUD Kebayoran Lama
          </h3>
          <p className="text-xs text-slate-300">
            Unduh atau simpan materi panduan stimulasi, ide bermain, dan resep gizi tinggi kalori langsung ke Google Drive Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Flyer Ide Stimulasi */}
          <div className="flex flex-col justify-between rounded-2xl bg-white/10 p-5 border border-white/10 backdrop-blur-sm space-y-4">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <h5 className="font-bold text-sm text-white">
                Flyer Ide Stimulasi Usia {AGE_GROUPS[ageGroupKey]?.label}
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Panduan praktis melatih wicara, bahasa, dan motorik anak sesuai usia saat ini.
              </p>
            </div>
            <a
              href={flyerStimulasiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
            >
              <span>Buka Google Drive</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Card 2: Flyer Ide Bermain */}
          <div className="flex flex-col justify-between rounded-2xl bg-white/10 p-5 border border-white/10 backdrop-blur-sm space-y-4">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <h5 className="font-bold text-sm text-white">Flyer Ide Bermain Edukatif</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Koleksi permainan sensori dan motorik kreatif orang tua bersama anak di rumah.
              </p>
            </div>
            <a
              href={flyerBermainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-500 py-2.5 text-xs font-bold text-white hover:bg-teal-600 transition"
            >
              <span>Buka Google Drive</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Card 3: Resep Makanan Tinggi Kalori */}
          <div className="flex flex-col justify-between rounded-2xl bg-white/10 p-5 border border-white/10 backdrop-blur-sm space-y-4">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Utensils className="h-5 w-5" />
              </div>
              <h5 className="font-bold text-sm text-white">Resep Makanan Tinggi Kalori</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Panduan menu padat energi dan protein hewani untuk mendongkrak berat badan anak.
              </p>
            </div>
            <a
              href={flyerResepUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition"
            >
              <span>Buka Google Drive</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Direct Contact RSUD Kebayoran Lama */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 no-print">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-base text-slate-900">
            Perlu Konsultasi Langsung dengan Dokter Spesialis Anak?
          </h4>
          <p className="text-xs text-slate-500">
            Poli Anak RSUD Kebayoran Lama siap melayani pemeriksaan tumbuh kembang lebih mendalam.
          </p>
        </div>

        <Link
          to="/kontak"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition shrink-0"
        >
          <PhoneCall className="h-4 w-4 text-emerald-400" />
          <span>Hubungi Poli Anak</span>
        </Link>
      </div>
    </div>
  );
}

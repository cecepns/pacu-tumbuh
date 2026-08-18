import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Send,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useScreening } from "@/context/ScreeningContext";
import { screeningService } from "@/services/screeningService";
import { MOTOR_ITEMS, evaluateMotor } from "@/data/motorChecklist";
import { AGE_GROUPS } from "@/data/communicationChecklist";

export default function SkriningMotorikPage() {
  const { session, setMotor } = useScreening();
  const navigate = useNavigate();

  const profile = session.profile;
  const kelompokUsia = profile?.kelompok_usia || "0-6";
  const items = MOTOR_ITEMS[kelompokUsia] || MOTOR_ITEMS["0-6"];

  const [answers, setAnswers] = useState(() => {
    if (session.motor?.answers && session.motor.answers.length === items.length) {
      return session.motor.answers;
    }
    return items.map(() => false);
  });

  const [tanggalScreening, setTanggalScreening] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [result, setResult] = useState(() => session.motorResult || null);
  const [loading, setLoading] = useState(false);

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Profil Anak Belum Diisi"
          description="Lengkapi profil anak terlebih dahulu untuk menentukan butir pertanyaan motorik yang sesuai dengan tahapan usia."
          action={
            <Link
              to="/profil-riwayat"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <span>Isi Profil Anak</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  const toggleAnswer = (index) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const selectAll = () => {
    setAnswers(items.map(() => true));
  };

  const deselectAll = () => {
    setAnswers(items.map(() => false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkedCount = answers.filter(Boolean).length;
    const totalCount = items.length;
    const evaluation = evaluateMotor(checkedCount, totalCount);

    const screeningData = {
      child_profile_id: profile.id,
      kelompok_usia: kelompokUsia,
      tanggal_screening: tanggalScreening,
      checklist_answers: items.map((item, i) => ({
        item,
        checked: Boolean(answers[i]),
      })),
      total_items: totalCount,
      checked_items: checkedCount,
      score: evaluation.score,
      status: evaluation.status,
      rekomendasi_stimulasi: evaluation.rekomendasi_stimulasi,
      rekomendasi_konsultasi: evaluation.rekomendasi_konsultasi,
    };

    setLoading(true);
    try {
      let savedData;
      if (typeof profile.id === "number") {
        const res = await screeningService.createMotor(screeningData);
        savedData = res.data;
      } else {
        savedData = { ...screeningData, id: `local-${Date.now()}` };
      }
      setMotor({ answers, kelompokUsia }, savedData);
      setResult(savedData);
      toast.success("Hasil skrining motorik berhasil dihitung dan disimpan!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      const fallback = { ...screeningData, id: `local-${Date.now()}` };
      setMotor({ answers, kelompokUsia }, fallback);
      setResult(fallback);
      toast.success("Hasil skrining motorik tersimpan di perangkat lokal.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Langkah 3 dari 4
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Skrining Kemampuan Motorik
          </h1>
          <p className="text-xs text-slate-500">
            Ananda <strong>{profile.nama_panggilan}</strong> ({profile.usia_bulan} Bulan) — Kelompok Usia:{" "}
            <strong>{AGE_GROUPS[kelompokUsia]?.label}</strong>
          </p>
        </div>
      </div>

      {/* HASIL INSTAN JIKA SUDAH DISUBMIT */}
      {result && (
        <div className="rounded-3xl border-2 border-teal-300 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 sm:p-8 shadow-md space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm sm:text-base">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <span>Hasil Deteksi Kemampuan Motorik</span>
            </div>
            <span className="text-xs font-extrabold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
              Skor: {result.score}%
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white border-4 border-teal-500 shadow-inner">
              <div className="text-center">
                <span className="text-2xl font-black text-slate-800">{result.score}%</span>
                <p className="text-[10px] font-bold text-slate-400">TERCAPAI</p>
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span
                className={`inline-block text-xs font-extrabold px-3 py-1 rounded-lg ${
                  result.score >= 80
                    ? "bg-emerald-100 text-emerald-800"
                    : result.score >= 50
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {result.status}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tercapai <strong>{result.checked_items}</strong> dari total <strong>{result.total_items}</strong> kemampuan motorik yang diuji.
              </p>
            </div>
          </div>

          <div className="grid gap-3 pt-2 text-xs">
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-1">
              <span className="font-bold text-teal-800">Rekomendasi Stimulasi Motorik:</span>
              <p className="text-slate-600 leading-relaxed">{result.rekomendasi_stimulasi}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-1">
              <span className="font-bold text-slate-800">Rekomendasi Medis / Fisioterapi:</span>
              <p className="text-slate-600 leading-relaxed">{result.rekomendasi_konsultasi}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-teal-100">
            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Ubah Jawaban Ceklis
            </button>
            <button
              type="button"
              onClick={() => navigate("/skrining-gizi")}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition"
            >
              <span>Lanjut ke Skrining Status Gizi</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Instruksi Pengisian */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 text-xs text-teal-900 leading-relaxed">
        <strong>Petunjuk:</strong> Silahkan lengkapi data perkembangan motorik anak sesuai dengan kemampuan dan kondisi terbaru, seperti kemampuan bergerak, duduk, berdiri, berjalan, menggunakan tangan, serta koordinasi gerak. Berikan centang (<strong>✓</strong>) pada butir yang sudah dapat dilakukan anak.
      </div>

      {/* FORM CHECKLIST */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>Daftar Kemampuan Motorik ({items.length} Butir):</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Centang Semua
            </button>
            <button
              type="button"
              onClick={deselectAll}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Hapus Semua
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isChecked = Boolean(answers[index]);
            return (
              <label
                key={index}
                className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all duration-150 ${
                  isChecked
                    ? "border-teal-500 bg-teal-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAnswer(index)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-lg border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div className="flex-1 space-y-0.5">
                  <span className="text-[11px] font-bold text-teal-700">
                    Butir {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    {item}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link
            to="/skrining-komunikasi"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Skrining Komunikasi</span>
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-teal-600/25 hover:from-teal-700 hover:to-emerald-700 transition disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? "Menghitung & Menyimpan..." : "Input & Lihat Hasil Motorik"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Apple,
  Scale,
  Ruler,
  Brain,
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import FormField from "@/components/ui/FormField";
import { useScreening } from "@/context/ScreeningContext";
import { screeningService } from "@/services/screeningService";
import { evaluateNutrition } from "@/data/nutritionStandards";
import {
  RIWAYAT_ASI_OPTIONS,
  RIWAYAT_MPASI_OPTIONS,
  RIWAYAT_MAKAN_OPTIONS,
  RIWAYAT_PENYAKIT_QUESTIONS,
} from "@/data/healthHistoryOptions";

export default function SkriningGiziPage() {
  const { session, setNutrition } = useScreening();
  const navigate = useNavigate();

  const profile = session.profile;

  const [form, setForm] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    if (session.nutrition?.measurements) {
      return { ...session.nutrition.measurements };
    }
    return {
      tanggal_pengukuran: today,
      bb_lahir_gram: "",
      bb_sekarang_gram: "",
      tb_cm: "",
      lk_cm: "",
      riwayat_asi: [],
      riwayat_mpasi: "Tepat 6 Bulan",
      riwayat_makan: [],
      riwayat_makan_lain: "",
      riwayat_penyakit: {
        demam: "Tidak",
        ispa: "Tidak",
        diare: "Tidak",
        kronis: "Tidak",
        rawat_inap: "Tidak",
      },
    };
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(() => session.nutritionResult || null);
  const [loading, setLoading] = useState(false);

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Profil Anak Belum Diisi"
          description="Silakan isi data profil dan tanggal lahir anak terlebih dahulu agar perhitungan Z-score status gizi akurat."
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAsiToggle = (opt) => {
    setForm((prev) => {
      const exists = prev.riwayat_asi.includes(opt);
      const updated = exists
        ? prev.riwayat_asi.filter((x) => x !== opt)
        : [...prev.riwayat_asi, opt];
      return { ...prev, riwayat_asi: updated };
    });
  };

  const handleMakanToggle = (opt) => {
    setForm((prev) => {
      const exists = prev.riwayat_makan.includes(opt);
      const updated = exists
        ? prev.riwayat_makan.filter((x) => x !== opt)
        : [...prev.riwayat_makan, opt];
      return { ...prev, riwayat_makan: updated };
    });
  };

  const handlePenyakitChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      riwayat_penyakit: { ...prev.riwayat_penyakit, [key]: value },
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.tanggal_pengukuran) newErrors.tanggal_pengukuran = "Tanggal pengukuran wajib diisi";
    if (!form.bb_sekarang_gram || Number(form.bb_sekarang_gram) <= 0) {
      newErrors.bb_sekarang_gram = "Berat badan saat ini wajib diisi (dalam gram, contoh: 9500)";
    }
    if (!form.tb_cm || Number(form.tb_cm) <= 0) {
      newErrors.tb_cm = "Panjang/tinggi badan wajib diisi (dalam cm, contoh: 75.5)";
    }
    if (!form.lk_cm || Number(form.lk_cm) <= 0) {
      newErrors.lk_cm = "Lingkar kepala wajib diisi (dalam cm, contoh: 45.0)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Mohon lengkapi data pengukuran antropometri anak");
      return;
    }

    const evaluation = evaluateNutrition({
      ageMonths: profile.usia_bulan || 0,
      bbGram: form.bb_sekarang_gram,
      tbCm: form.tb_cm,
      lkCm: form.lk_cm,
      riwayatPenyakit: form.riwayat_penyakit,
      riwayatMakan: form.riwayat_makan,
    });

    const screeningData = {
      child_profile_id: profile.id,
      tanggal_pengukuran: form.tanggal_pengukuran,
      bb_lahir_gram: Number(form.bb_lahir_gram) || 0,
      bb_sekarang_gram: Number(form.bb_sekarang_gram),
      tb_cm: Number(form.tb_cm),
      lk_cm: Number(form.lk_cm),
      riwayat_asi: form.riwayat_asi,
      riwayat_mpasi: form.riwayat_mpasi,
      riwayat_makan: form.riwayat_makan,
      riwayat_makan_lain: form.riwayat_makan_lain,
      riwayat_penyakit: form.riwayat_penyakit,
      status_bbu: evaluation.statusBBU,
      status_tbu: evaluation.statusTBU,
      status_bbtb: evaluation.statusBBTB,
      status_lku: evaluation.statusLKU,
      status_keseluruhan: evaluation.statusKeseluruhan,
      rekomendasi_gizi: evaluation.rekomendasiGizi,
    };

    setLoading(true);
    try {
      let savedData;
      if (typeof profile.id === "number") {
        const res = await screeningService.createNutrition(screeningData);
        savedData = res.data;
      } else {
        savedData = { ...screeningData, ...evaluation, id: `local-${Date.now()}` };
      }
      const combined = { ...savedData, ...evaluation };
      setNutrition({ measurements: form }, combined);
      setResult(combined);
      toast.success("Hasil skrining status gizi berhasil dihitung & disimpan!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      const fallback = { ...screeningData, ...evaluation, id: `local-${Date.now()}` };
      setNutrition({ measurements: form }, fallback);
      setResult(fallback);
      toast.success("Hasil skrining status gizi tersimpan di perangkat lokal.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
          <Apple className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Langkah 4 dari 4
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Skrining Status Gizi & Pola Asuh
          </h1>
          <p className="text-xs text-slate-500">
            Pengukuran antropometri anak <strong>{profile.nama_panggilan}</strong> ({profile.usia_bulan} Bulan) standar Kemenkes/WHO.
          </p>
        </div>
      </div>

      {/* HASIL INSTAN JIKA SUDAH DISUBMIT */}
      {result && (
        <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <span>Hasil Analisis Status Gizi & Antropometri</span>
            </div>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                result.statusColor === "green"
                  ? "bg-emerald-100 text-emerald-800"
                  : result.statusColor === "yellow"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {result.statusColor === "green"
                ? "Gizi Baik"
                : result.statusColor === "yellow"
                ? "Perlu Pemantauan"
                : "Perlu Intervensi"}
            </span>
          </div>

          {/* Status Keseluruhan */}
          <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kesimpulan Status Gizi:
            </span>
            <p className="text-base font-extrabold text-slate-800">
              {result.status_keseluruhan || result.statusKeseluruhan}
            </p>
          </div>

          {/* 4 Cards Antropometri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* BB/U */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Berat Badan / Usia (BB/U)</span>
                <Scale className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm font-extrabold text-slate-800">
                {result.status_bbu || result.statusBBU}
              </p>
              <p className="text-[11px] text-slate-400">
                BB: {result.bb_sekarang_gram ? result.bb_sekarang_gram / 1000 : result.bbKg} kg (Z-Score: {result.zBBU || "0.0"})
              </p>
            </div>

            {/* TB/U */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Tinggi Badan / Usia (TB/U)</span>
                <Ruler className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm font-extrabold text-slate-800">
                {result.status_tbu || result.statusTBU}
              </p>
              <p className="text-[11px] text-slate-400">
                TB/PB: {result.tb_cm || result.tbCm} cm (Z-Score: {result.zTBU || "0.0"})
              </p>
            </div>

            {/* BB/TB */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Berat / Tinggi (BB/TB)</span>
                <Apple className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm font-extrabold text-slate-800">
                {result.status_bbtb || result.statusBBTB}
              </p>
              <p className="text-[11px] text-slate-400">
                Indeks Proporsi Tubuh (Z-Score: {result.zBBTB || "0.0"})
              </p>
            </div>

            {/* LK/U */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Lingkar Kepala / Usia (LK/U)</span>
                <Brain className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm font-extrabold text-slate-800">
                {result.status_lku || result.statusLKU}
              </p>
              <p className="text-[11px] text-slate-400">
                LK: {result.lk_cm || result.lkCm} cm (Z-Score: {result.zLK || "0.0"})
              </p>
            </div>
          </div>

          {/* Rekomendasi Gizi */}
          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-1 text-xs">
            <span className="font-bold text-amber-800">Rekomendasi Pemenuhan Gizi & Asupan:</span>
            <p className="text-slate-600 leading-relaxed">
              {result.rekomendasi_gizi || result.rekomendasiGizi}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-amber-100">
            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Ubah Data Pengukuran
            </button>
            <button
              type="button"
              onClick={() => navigate("/evaluasi")}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition"
            >
              <span>Lihat Rangkuman Evaluasi Lengkap</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* FORM PENGUKURAN & KESEHATAN */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Antropometri */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
            <Scale className="h-5 w-5 text-amber-600" />
            <span>Data Pengukuran Antropometri</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Tanggal Pengukuran Terakhir"
              name="tanggal_pengukuran"
              type="date"
              value={form.tanggal_pengukuran}
              onChange={handleFormChange}
              max={new Date().toISOString().split("T")[0]}
              required
              error={errors.tanggal_pengukuran}
            />

            <FormField
              label="Berat Badan Lahir (gram)"
              name="bb_lahir_gram"
              type="number"
              value={form.bb_lahir_gram}
              onChange={handleFormChange}
              placeholder="Contoh: 3100"
              suffix="gram"
              helperText="Tuliskan dalam gram (misal 3.1 kg = 3100)"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              label="Berat Badan Saat Ini (gram)"
              name="bb_sekarang_gram"
              type="number"
              value={form.bb_sekarang_gram}
              onChange={handleFormChange}
              placeholder="Contoh: 9200"
              suffix="gram"
              required
              error={errors.bb_sekarang_gram}
              helperText="Misal: 9.2 kg = 9200"
            />

            <FormField
              label="Panjang / Tinggi Badan (cm)"
              name="tb_cm"
              type="number"
              step="0.1"
              value={form.tb_cm}
              onChange={handleFormChange}
              placeholder="Contoh: 76.5"
              suffix="cm"
              required
              error={errors.tb_cm}
            />

            <FormField
              label="Lingkar Kepala (cm)"
              name="lk_cm"
              type="number"
              step="0.1"
              value={form.lk_cm}
              onChange={handleFormChange}
              placeholder="Contoh: 45.2"
              suffix="cm"
              required
              error={errors.lk_cm}
            />
          </div>
        </div>

        {/* Card 2: Riwayat ASI & MPASI */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
            <Apple className="h-5 w-5 text-amber-600" />
            <span>Riwayat Pemberian ASI & MPASI</span>
          </div>

          {/* ASI */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Pemberian ASI
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {RIWAYAT_ASI_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-xs transition ${
                    form.riwayat_asi.includes(opt)
                      ? "border-amber-500 bg-amber-50/70 font-semibold text-amber-900"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.riwayat_asi.includes(opt)}
                    onChange={() => handleAsiToggle(opt)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* MPASI */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Pemberian MPASI
            </label>
            <p className="text-[11px] text-slate-500">
              MPASI (Makanan Pendamping ASI) yaitu makanan dan minuman yang diberikan kepada anak selain ASI.
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {RIWAYAT_MPASI_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    form.riwayat_mpasi === opt
                      ? "border-amber-500 bg-amber-50 text-amber-900 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="riwayat_mpasi"
                    value={opt}
                    checked={form.riwayat_mpasi === opt}
                    onChange={handleFormChange}
                    className="sr-only"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Riwayat Makan */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Makan Sehari-hari
            </label>
            <div className="grid gap-2">
              {RIWAYAT_MAKAN_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-xs transition ${
                    form.riwayat_makan.includes(opt)
                      ? "border-amber-500 bg-amber-50/70 font-semibold text-amber-900"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.riwayat_makan.includes(opt)}
                    onChange={() => handleMakanToggle(opt)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <FormField
              name="riwayat_makan_lain"
              value={form.riwayat_makan_lain}
              onChange={handleFormChange}
              placeholder="Kebiasaan makan lainnya (tuliskan jika ada)..."
            />
          </div>
        </div>

        {/* Card 3: Riwayat Penyakit (Tabel Ya / Tidak) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
            <HelpCircle className="h-5 w-5 text-amber-600" />
            <span>Riwayat Penyakit Anak</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Pertanyaan Riwayat Penyakit</th>
                  <th className="py-3 px-4 text-center w-24">Ya</th>
                  <th className="py-3 px-4 text-center w-24">Tidak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {RIWAYAT_PENYAKIT_QUESTIONS.map((q) => {
                  const currentVal = form.riwayat_penyakit[q.key] || "Tidak";
                  return (
                    <tr key={q.key} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-medium text-slate-800">{q.label}</td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="radio"
                          name={`penyakit_${q.key}`}
                          value="Ya"
                          checked={currentVal === "Ya"}
                          onChange={() => handlePenyakitChange(q.key, "Ya")}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="radio"
                          name={`penyakit_${q.key}`}
                          value="Tidak"
                          checked={currentVal === "Tidak"}
                          onChange={() => handlePenyakitChange(q.key, "Tidak")}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link
            to="/skrining-motorik"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Skrining Motorik</span>
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-600/25 hover:from-amber-700 hover:to-emerald-700 transition disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? "Menghitung & Menganalisis..." : "Input & Lihat Hasil Status Gizi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

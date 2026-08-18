import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserCheck,
  Calendar,
  Save,
  ArrowRight,
  Heart,
  Baby,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useScreening } from "@/context/ScreeningContext";
import { childProfileService } from "@/services/screeningService";
import { calculateAgeInMonths, getAgeGroup, AGE_GROUPS } from "@/data/communicationChecklist";
import {
  RIWAYAT_KANDUNGAN_OPTIONS,
  RIWAYAT_SAAT_LAHIR_OPTIONS,
  RIWAYAT_SETELAH_LAHIR_OPTIONS,
} from "@/data/healthHistoryOptions";
import { APP_INFO } from "@/data/content";

export default function ProfilRiwayatPage() {
  const navigate = useNavigate();
  const { session, setProfile, setHealthHistory } = useScreening();

  const [form, setForm] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    if (session.profile) {
      return {
        tanggal_input: session.profile.tanggal_input || today,
        nama_lengkap: session.profile.nama_lengkap || "",
        nama_panggilan: session.profile.nama_panggilan || "",
        tanggal_lahir: session.profile.tanggal_lahir?.split("T")[0] || "",
        jenis_kelamin: session.profile.jenis_kelamin || "L",
        nama_orang_tua: session.profile.nama_orang_tua || "",
        nomor_telepon: session.profile.nomor_telepon || "",
        keluhan_ortu: session.profile.keluhan_ortu || "",
      };
    }
    return {
      tanggal_input: today,
      nama_lengkap: "",
      nama_panggilan: "",
      tanggal_lahir: "",
      jenis_kelamin: "L",
      nama_orang_tua: "",
      nomor_telepon: "",
      keluhan_ortu: "",
    };
  });

  const [healthHistory, setHealthHistoryState] = useState(() => {
    if (session.healthHistory) {
      return {
        riwayat_kandungan: session.healthHistory.riwayat_kandungan || [],
        riwayat_kandungan_lain: session.healthHistory.riwayat_kandungan_lain || "",
        riwayat_saat_lahir: session.healthHistory.riwayat_saat_lahir || [],
        riwayat_saat_lahir_lain: session.healthHistory.riwayat_saat_lahir_lain || "",
        riwayat_setelah_lahir: session.healthHistory.riwayat_setelah_lahir || [],
        riwayat_setelah_lahir_lain: session.healthHistory.riwayat_setelah_lahir_lain || "",
      };
    }
    return {
      riwayat_kandungan: [],
      riwayat_kandungan_lain: "",
      riwayat_saat_lahir: [],
      riwayat_saat_lahir_lain: "",
      riwayat_setelah_lahir: [],
      riwayat_setelah_lahir_lain: "",
    };
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const usiaBulan = form.tanggal_lahir ? calculateAgeInMonths(form.tanggal_lahir) : null;
  const kelompokUsia = usiaBulan !== null ? getAgeGroup(usiaBulan) : null;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxToggle = (category, value) => {
    setHealthHistoryState((prev) => {
      const currentList = prev[category] || [];
      let updated;

      if (value === "Tidak ada") {
        updated = currentList.includes("Tidak ada") ? [] : ["Tidak ada"];
      } else {
        const withoutTidakAda = currentList.filter((item) => item !== "Tidak ada");
        if (withoutTidakAda.includes(value)) {
          updated = withoutTidakAda.filter((item) => item !== value);
        } else {
          updated = [...withoutTidakAda, value];
        }
      }

      return { ...prev, [category]: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nama_lengkap.trim()) newErrors.nama_lengkap = "Nama lengkap anak wajib diisi";
    if (!form.nama_panggilan.trim()) newErrors.nama_panggilan = "Nama panggilan anak wajib diisi";
    if (!form.tanggal_lahir) newErrors.tanggal_lahir = "Tanggal lahir anak wajib diisi";
    if (!form.nama_orang_tua.trim()) newErrors.nama_orang_tua = "Nama orang tua wajib diisi";
    if (!form.nomor_telepon.trim()) newErrors.nomor_telepon = "Nomor telepon aktif wajib diisi";

    if (usiaBulan !== null && usiaBulan > 36) {
      // Allow up to 36 with warning or standard
      toast("Anak berusia di atas 36 bulan (3 tahun). Skrining akan menggunakan standar 31–36 bulan.", {
        icon: "ℹ️",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitAndContinue = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Mohon lengkapi semua kolom wajib dengan benar");
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      usia_bulan: usiaBulan || 0,
      kelompok_usia: kelompokUsia || "0-6",
      ...healthHistory,
    };

    try {
      let saved;
      if (session.profile?.id && typeof session.profile.id === "number") {
        const res = await childProfileService.update(session.profile.id, payload);
        saved = res.data;
      } else {
        const res = await childProfileService.create(payload);
        saved = res.data;
      }
      setProfile(saved);
      setHealthHistory(healthHistory);
      toast.success("Profil & riwayat anak berhasil disimpan secara otomatis!");
      navigate("/skrining-komunikasi");
    } catch (err) {
      // Local storage fallback if server not running or network issue
      const localProfile = {
        ...payload,
        id: session.profile?.id || `local-${Date.now()}`,
      };
      setProfile(localProfile);
      setHealthHistory(healthHistory);
      toast.success("Data tersimpan di perangkat lokal. Melanjutkan ke skrining...");
      navigate("/skrining-komunikasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
          <UserCheck className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Langkah 1 dari 4
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Profil & Riwayat Kesehatan Anak
          </h1>
          <p className="text-xs text-slate-500">
            Data otomatis tersimpan saat Anda menekan tombol "Lanjutkan".
          </p>
        </div>
      </div>

      {/* Intro Note */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 leading-relaxed">
        <strong>Petunjuk Pengisian:</strong> {APP_INFO.instructions}
      </div>

      <form onSubmit={handleSubmitAndContinue} className="space-y-8">
        {/* BAGIAN 1: IDENTITAS ANAK */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
            <Baby className="h-5 w-5 text-emerald-600" />
            <span>Identitas Anak & Orang Tua</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Tanggal Input"
              name="tanggal_input"
              type="date"
              value={form.tanggal_input}
              onChange={handleFormChange}
              required
              error={errors.tanggal_input}
            />
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                    form.jenis_kelamin === "L"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="L"
                    checked={form.jenis_kelamin === "L"}
                    onChange={handleFormChange}
                    className="sr-only"
                  />
                  <span>Laki-laki</span>
                </label>
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                    form.jenis_kelamin === "P"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="P"
                    checked={form.jenis_kelamin === "P"}
                    onChange={handleFormChange}
                    className="sr-only"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>
          </div>

          <FormField
            label="Nama Lengkap Anak"
            name="nama_lengkap"
            value={form.nama_lengkap}
            onChange={handleFormChange}
            placeholder="Contoh: Muhammad Arka Pratama"
            required
            error={errors.nama_lengkap}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Nama Panggilan"
              name="nama_panggilan"
              value={form.nama_panggilan}
              onChange={handleFormChange}
              placeholder="Contoh: Arka"
              required
              error={errors.nama_panggilan}
            />

            <FormField
              label="Tanggal Lahir Anak"
              name="tanggal_lahir"
              type="date"
              value={form.tanggal_lahir}
              onChange={handleFormChange}
              max={new Date().toISOString().split("T")[0]}
              required
              error={errors.tanggal_lahir}
            />
          </div>

          {/* Age Group Calculation Pill */}
          {usiaBulan !== null && kelompokUsia && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-200 p-4 text-xs text-emerald-900">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                {usiaBulan}
              </div>
              <div>
                <p className="font-bold text-sm">
                  Usia Anak: {usiaBulan} Bulan
                </p>
                <p className="text-emerald-700">
                  Kelompok Skrining: <strong>{AGE_GROUPS[kelompokUsia]?.label}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Nama Orang Tua (Ayah / Ibu)"
              name="nama_orang_tua"
              value={form.nama_orang_tua}
              onChange={handleFormChange}
              placeholder="Nama lengkap orang tua / wali"
              required
              error={errors.nama_orang_tua}
            />

            <FormField
              label="Nomor Telepon / WhatsApp"
              name="nomor_telepon"
              type="tel"
              value={form.nomor_telepon}
              onChange={handleFormChange}
              placeholder="08xxxxxxxxxx"
              required
              error={errors.nomor_telepon}
            />
          </div>

          <FormField
            label="Keluhan Orang Tua"
            name="keluhan_ortu"
            value={form.keluhan_ortu}
            onChange={handleFormChange}
            rows={3}
            placeholder="Jelaskan permasalahan tumbuh kembang anak yang dialami (jika ada)..."
            helperText="Opsional: Tuliskan kekhawatiran terkait bicara, motorik, atau nafsu makan anak."
          />
        </div>

        {/* BAGIAN 2: RIWAYAT KESEHATAN ANAK */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
            <Activity className="h-5 w-5 text-emerald-600" />
            <span>Riwayat Kesehatan Anak</span>
          </div>

          {/* 1. Riwayat Dalam Kandungan */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Kesehatan Anak dalam Kandungan <span className="text-rose-500">*</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {RIWAYAT_KANDUNGAN_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs transition ${
                    healthHistory.riwayat_kandungan.includes(opt)
                      ? "border-emerald-500 bg-emerald-50/70 font-semibold text-emerald-900"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={healthHistory.riwayat_kandungan.includes(opt)}
                    onChange={() => handleCheckboxToggle("riwayat_kandungan", opt)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <FormField
              name="riwayat_kandungan_lain"
              value={healthHistory.riwayat_kandungan_lain}
              onChange={(e) =>
                setHealthHistoryState((prev) => ({
                  ...prev,
                  riwayat_kandungan_lain: e.target.value,
                }))
              }
              placeholder="Yang lain (tuliskan jika ada)..."
            />
          </div>

          {/* 2. Riwayat Saat Dilahirkan */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Anak Saat Dilahirkan <span className="text-rose-500">*</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {RIWAYAT_SAAT_LAHIR_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs transition ${
                    healthHistory.riwayat_saat_lahir.includes(opt)
                      ? "border-emerald-500 bg-emerald-50/70 font-semibold text-emerald-900"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={healthHistory.riwayat_saat_lahir.includes(opt)}
                    onChange={() => handleCheckboxToggle("riwayat_saat_lahir", opt)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <FormField
              name="riwayat_saat_lahir_lain"
              value={healthHistory.riwayat_saat_lahir_lain}
              onChange={(e) =>
                setHealthHistoryState((prev) => ({
                  ...prev,
                  riwayat_saat_lahir_lain: e.target.value,
                }))
              }
              placeholder="Yang lain (tuliskan jika ada)..."
            />
          </div>

          {/* 3. Riwayat Setelah Lahir */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Kesehatan Setelah Lahir <span className="text-rose-500">*</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {RIWAYAT_SETELAH_LAHIR_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs transition ${
                    healthHistory.riwayat_setelah_lahir.includes(opt)
                      ? "border-emerald-500 bg-emerald-50/70 font-semibold text-emerald-900"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={healthHistory.riwayat_setelah_lahir.includes(opt)}
                    onChange={() => handleCheckboxToggle("riwayat_setelah_lahir", opt)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <FormField
              name="riwayat_setelah_lahir_lain"
              value={healthHistory.riwayat_setelah_lahir_lain}
              onChange={(e) =>
                setHealthHistoryState((prev) => ({
                  ...prev,
                  riwayat_setelah_lahir_lain: e.target.value,
                }))
              }
              placeholder="Yang lain (tuliskan jika ada)..."
            />
          </div>
        </div>

        {/* Submit / Continue Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            * Data akan tersimpan secara otomatis dan aman di sistem RSUD Kebayoran Lama.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Menyimpan Data..." : "Lanjutkan ke Skrining Komunikasi"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

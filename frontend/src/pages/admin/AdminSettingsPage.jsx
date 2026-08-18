import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Settings,
  Save,
  Link2,
  Phone,
  Building,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { settingsService } from "@/services/settingsService";
import FormField from "@/components/ui/FormField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    rs_name: "RSUD Kebayoran Lama",
    rs_address: "Jl. Kebayoran Lama No. 130, Kebayoran Lama Selatan, Jakarta Selatan",
    rs_phone: "(021) 7234567",
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await settingsService.getSettings();
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
      } catch {
        toast.error("Gagal memuat pengaturan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success("Pengaturan & link Google Drive berhasil disimpan");
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Memuat konfigurasi..." size="lg" />;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">
          Pengaturan Aplikasi & Tautan Google Drive
        </h1>
        <p className="text-xs text-slate-500">
          Kelola tautan flyer materi edukasi dan informasi kontak resmi RSUD Kebayoran Lama.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Card 1: Google Drive Flyer Stimulasi */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
            <Link2 className="h-4 w-4 text-emerald-600" />
            <span>Tautan Google Drive — Flyer Ide Stimulasi per Kelompok Usia</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Flyer Stimulasi Usia 0–6 Bulan"
              name="drive_flyer_stimulasi_0_6"
              value={settings.drive_flyer_stimulasi_0_6}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
            <FormField
              label="Flyer Stimulasi Usia 7–12 Bulan"
              name="drive_flyer_stimulasi_7_12"
              value={settings.drive_flyer_stimulasi_7_12}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
            <FormField
              label="Flyer Stimulasi Usia 13–18 Bulan"
              name="drive_flyer_stimulasi_13_18"
              value={settings.drive_flyer_stimulasi_13_18}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
            <FormField
              label="Flyer Stimulasi Usia 19–24 Bulan"
              name="drive_flyer_stimulasi_19_24"
              value={settings.drive_flyer_stimulasi_19_24}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
            <FormField
              label="Flyer Stimulasi Usia 25–30 Bulan"
              name="drive_flyer_stimulasi_25_30"
              value={settings.drive_flyer_stimulasi_25_30}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
            <FormField
              label="Flyer Stimulasi Usia 31–36 Bulan"
              name="drive_flyer_stimulasi_31_36"
              value={settings.drive_flyer_stimulasi_31_36}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
          </div>
        </div>

        {/* Card 2: Flyer Ide Bermain & Resep Makanan */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
            <Link2 className="h-4 w-4 text-teal-600" />
            <span>Tautan Google Drive — Flyer Ide Bermain & Resep Makanan</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Flyer Ide Bermain Edukatif"
              name="drive_flyer_ide_bermain"
              value={settings.drive_flyer_ide_bermain}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
            <FormField
              label="Flyer Resep Makanan Tinggi Kalori"
              name="drive_flyer_resep_tinggi_kalori"
              value={settings.drive_flyer_resep_tinggi_kalori}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
          </div>
        </div>

        {/* Card 3: Kontak & Informasi RS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
            <Building className="h-4 w-4 text-emerald-600" />
            <span>Informasi Kontak Resmi Rumah Sakit</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nama Rumah Sakit"
              name="rs_name"
              value={settings.rs_name}
              onChange={handleChange}
            />
            <FormField
              label="Nomor Telepon RS"
              name="rs_phone"
              value={settings.rs_phone}
              onChange={handleChange}
            />
            <FormField
              label="Nomor WhatsApp Konsultasi"
              name="rs_whatsapp"
              value={settings.rs_whatsapp}
              onChange={handleChange}
              helperText="Format tanpa tanda plus, contoh: 6281234567890"
            />
            <FormField
              label="Alamat Rumah Sakit"
              name="rs_address"
              value={settings.rs_address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  PhoneCall,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Mail,
  Send,
  Building,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import FormField from "@/components/ui/FormField";
import { settingsService } from "@/services/settingsService";
import { CONTACT_INFO, APP_INFO } from "@/data/content";

export default function KontakPage() {
  const [settings, setSettings] = useState(null);
  const [inquiry, setInquiry] = useState({
    nama: "",
    telepon: "",
    pesan: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await settingsService.getSettings();
        setSettings(res.data);
      } catch {
        setSettings(CONTACT_INFO);
      }
    }
    loadSettings();
  }, []);

  const phone = settings?.rs_phone || CONTACT_INFO.phone;
  const whatsapp = settings?.rs_whatsapp || CONTACT_INFO.whatsapp;
  const address = settings?.rs_address || CONTACT_INFO.address;
  const rsName = settings?.rs_name || CONTACT_INFO.rs_name;

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiry.nama || !inquiry.pesan) {
      toast.error("Mohon isi nama dan pertanyaan Anda");
      return;
    }

    const text = encodeURIComponent(
      `Halo Tim Poli Anak ${rsName},\nSaya ${inquiry.nama} (${inquiry.telepon || "-"})\nIngin bertanya terkait PACU TUMBUH:\n"${inquiry.pesan}"`
    );
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
    toast.success("Membuka WhatsApp untuk mengirim pesan...");
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
          <PhoneCall className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Layanan Informasi
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Kontak Konsultasi & Lokasi
          </h1>
          <p className="text-xs text-slate-500">
            {rsName} — Poli Tumbuh Kembang & Kesehatan Anak
          </p>
        </div>
      </div>

      {/* 3 Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* WhatsApp Direct */}
        <div className="flex flex-col justify-between rounded-3xl border-2 border-emerald-500 bg-emerald-50/60 p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">WhatsApp Poli Anak</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Konsultasi cepat, pendaftaran antrean poli, dan tanya jawab skrining via WhatsApp resmi.
            </p>
            <p className="font-mono text-sm font-bold text-emerald-800">+62 811-1703-2345</p>
          </div>

          <a
            href={`https://wa.me/${whatsapp}?text=Halo%20Admin%20PACU%20TUMBUH%20RSUD%20Kebayoran%20Lama,%20saya%20ingin%20konsultasi%20tumbuh%20kembang%20anak`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
          >
            <span>Chat WhatsApp Sekarang</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Telepon RS */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 shadow-sm">
              <Phone className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Call Center Rumah Sakit</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Layanan informasi umum dan darurat 24 jam RSUD Kebayoran Lama.
            </p>
            <p className="font-mono text-sm font-bold text-slate-900">{phone}</p>
          </div>

          <a
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Panggil Telepon</span>
          </a>
        </div>

        {/* Jadwal Pelayanan */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 shadow-sm">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Jam Operasional Poli</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Senin – Jumat: 08.00 – 15.00 WIB
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sabtu: 08.00 – 12.00 WIB
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5 text-center text-[11px] font-semibold text-slate-600">
            IGD & UGD Melayani 24 Jam
          </div>
        </div>
      </div>

      {/* Alamat & Maps Embed */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
          <MapPin className="h-5 w-5 text-emerald-600" />
          <span>Lokasi & Petunjuk Arah</span>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-900">{rsName}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{address}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 aspect-[16/9] w-full">
          <iframe
            src={CONTACT_INFO.google_maps_embed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi RSUD Kebayoran Lama"
          />
        </div>
      </div>

      {/* Form Kirim Pesan Cepat */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
          <Send className="h-5 w-5 text-emerald-600" />
          <span>Kirim Pertanyaan Langsung ke WhatsApp Nakes</span>
        </div>

        <form onSubmit={handleInquirySubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nama Lengkap Anda"
              name="nama"
              value={inquiry.nama}
              onChange={(e) => setInquiry((prev) => ({ ...prev, nama: e.target.value }))}
              placeholder="Contoh: Ibu Rina"
              required
            />
            <FormField
              label="Nomor WhatsApp"
              name="telepon"
              type="tel"
              value={inquiry.telepon}
              onChange={(e) => setInquiry((prev) => ({ ...prev, telepon: e.target.value }))}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <FormField
            label="Pertanyaan atau Pesan Anda"
            name="pesan"
            value={inquiry.pesan}
            onChange={(e) => setInquiry((prev) => ({ ...prev, pesan: e.target.value }))}
            rows={3}
            placeholder="Tuliskan pertanyaan terkait kondisi tumbuh kembang anak, jadwal dokter, atau bantuan skrining..."
            required
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <Send className="h-4 w-4" />
              <span>Kirim via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

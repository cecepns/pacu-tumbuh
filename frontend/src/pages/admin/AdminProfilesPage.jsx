import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  Baby,
  Activity,
  Phone,
  Calendar,
} from "lucide-react";
import { childProfileService } from "@/services/screeningService";
import Modal from "@/components/admin/Modal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Pagination from "@/components/admin/Pagination";
import FormField from "@/components/ui/FormField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { calculateAgeInMonths, getAgeGroup, AGE_GROUPS } from "@/data/communicationChecklist";
import {
  RIWAYAT_KANDUNGAN_OPTIONS,
  RIWAYAT_SAAT_LAHIR_OPTIONS,
  RIWAYAT_SETELAH_LAHIR_OPTIONS,
} from "@/data/healthHistoryOptions";

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterKelompok, setFilterKelompok] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const initialForm = {
    tanggal_input: new Date().toISOString().split("T")[0],
    nama_lengkap: "",
    nama_panggilan: "",
    tanggal_lahir: "",
    jenis_kelamin: "L",
    nama_orang_tua: "",
    nomor_telepon: "",
    keluhan_ortu: "",
    riwayat_kandungan: [],
    riwayat_kandungan_lain: "",
    riwayat_saat_lahir: [],
    riwayat_saat_lahir_lain: "",
    riwayat_setelah_lahir: [],
    riwayat_setelah_lahir_lain: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Profiles
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await childProfileService.list({
        page,
        limit,
        search: debouncedSearch,
        kelompok_usia: filterKelompok,
      });
      setProfiles(res.data || []);
      if (res.pagination) {
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Gagal memuat daftar profil anak");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filterKelompok]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData(initialForm);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (profile) => {
    setModalMode("edit");
    setSelectedProfile(profile);

    // parse JSON if needed
    const parseJson = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    };

    setFormData({
      tanggal_input: profile.tanggal_input?.split("T")[0] || "",
      nama_lengkap: profile.nama_lengkap || "",
      nama_panggilan: profile.nama_panggilan || "",
      tanggal_lahir: profile.tanggal_lahir?.split("T")[0] || "",
      jenis_kelamin: profile.jenis_kelamin || "L",
      nama_orang_tua: profile.nama_orang_tua || "",
      nomor_telepon: profile.nomor_telepon || "",
      keluhan_ortu: profile.keluhan_ortu || "",
      riwayat_kandungan: parseJson(profile.riwayat_kandungan),
      riwayat_kandungan_lain: profile.riwayat_kandungan_lain || "",
      riwayat_saat_lahir: parseJson(profile.riwayat_saat_lahir),
      riwayat_saat_lahir_lain: profile.riwayat_saat_lahir_lain || "",
      riwayat_setelah_lahir: parseJson(profile.riwayat_setelah_lahir),
      riwayat_setelah_lahir_lain: profile.riwayat_setelah_lahir_lain || "",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenDetail = async (profile) => {
    setSelectedProfile(profile);
    setIsDetailModalOpen(true);
    try {
      const res = await childProfileService.detail(profile.id);
      setSelectedProfile(res.data);
    } catch {
      // Use existing profile
    }
  };

  const handleOpenDelete = (profile) => {
    setSelectedProfile(profile);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProfile) return;
    setActionLoading(true);
    try {
      await childProfileService.delete(selectedProfile.id);
      toast.success("Profil anak berhasil dihapus");
      setIsDeleteModalOpen(false);
      fetchProfiles();
    } catch (err) {
      toast.error(err.message || "Gagal menghapus profil");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxToggle = (category, value) => {
    setFormData((prev) => {
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

  const validateForm = () => {
    const errs = {};
    if (!formData.nama_lengkap.trim()) errs.nama_lengkap = "Nama lengkap wajib diisi";
    if (!formData.nama_panggilan.trim()) errs.nama_panggilan = "Nama panggilan wajib diisi";
    if (!formData.tanggal_lahir) errs.tanggal_lahir = "Tanggal lahir wajib diisi";
    if (!formData.nama_orang_tua.trim()) errs.nama_orang_tua = "Nama orang tua wajib diisi";
    if (!formData.nomor_telepon.trim()) errs.nomor_telepon = "Nomor telepon wajib diisi";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setActionLoading(true);
    const usiaBulan = calculateAgeInMonths(formData.tanggal_lahir);
    const kelompokUsia = getAgeGroup(usiaBulan) || "0-6";

    const payload = {
      ...formData,
      usia_bulan: usiaBulan,
      kelompok_usia: kelompokUsia,
    };

    try {
      if (modalMode === "create") {
        await childProfileService.create(payload);
        toast.success("Profil anak berhasil ditambahkan");
      } else {
        await childProfileService.update(selectedProfile.id, payload);
        toast.success("Profil anak berhasil diperbarui");
      }
      setIsFormModalOpen(false);
      fetchProfiles();
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan data profil");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">
            Data Profil & Riwayat Pasien Anak
          </h1>
          <p className="text-xs text-slate-500">
            Kelola dan pantau seluruh data identitas anak yang terdaftar di PACU TUMBUH.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Data Anak</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Realtime Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama anak, nama orang tua, atau nomor telepon..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Kelompok Usia */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={filterKelompok}
            onChange={(e) => {
              setFilterKelompok(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white"
          >
            <option value="">Semua Usia</option>
            {Object.entries(AGE_GROUPS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchProfiles}
            title="Refresh Data"
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading && !profiles.length ? (
          <LoadingSpinner text="Memuat data profil anak..." size="lg" />
        ) : profiles.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Tidak Ada Profil Ditemukan"
              description="Belum ada data anak yang sesuai dengan kriteria pencarian atau filter yang dipilih."
              action={
                <button
                  onClick={handleOpenCreate}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  Tambah Profil Baru
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="py-3.5 px-4">Nama Anak</th>
                  <th className="py-3.5 px-4">Usia / Kelompok</th>
                  <th className="py-3.5 px-4">Orang Tua</th>
                  <th className="py-3.5 px-4">No. Telepon</th>
                  <th className="py-3.5 px-4">Tgl Input</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-sm">{item.nama_lengkap}</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Panggilan: {item.nama_panggilan} ({item.jenis_kelamin === "P" ? "Perempuan" : "Laki-laki"})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        {item.usia_bulan} Bulan ({AGE_GROUPS[item.kelompok_usia]?.label || item.kelompok_usia})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{item.nama_orang_tua}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{item.nomor_telepon}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.tanggal_input?.split("T")[0]}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          title="Lihat Detail"
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Data"
                          className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 transition"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item)}
                          title="Hapus Data"
                          className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-slate-100 px-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            total={total}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* MODAL FORM CREATE / EDIT */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={modalMode === "create" ? "Tambah Data Profil & Riwayat Anak" : "Edit Profil Anak"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Tanggal Input"
              name="tanggal_input"
              type="date"
              value={formData.tanggal_input}
              onChange={handleFormChange}
              required
            />
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2 text-xs font-bold ${
                    formData.jenis_kelamin === "L"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="L"
                    checked={formData.jenis_kelamin === "L"}
                    onChange={handleFormChange}
                    className="sr-only"
                  />
                  <span>Laki-laki</span>
                </label>
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2 text-xs font-bold ${
                    formData.jenis_kelamin === "P"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="P"
                    checked={formData.jenis_kelamin === "P"}
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
            value={formData.nama_lengkap}
            onChange={handleFormChange}
            required
            error={formErrors.nama_lengkap}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nama Panggilan"
              name="nama_panggilan"
              value={formData.nama_panggilan}
              onChange={handleFormChange}
              required
              error={formErrors.nama_panggilan}
            />
            <FormField
              label="Tanggal Lahir"
              name="tanggal_lahir"
              type="date"
              value={formData.tanggal_lahir}
              onChange={handleFormChange}
              required
              error={formErrors.tanggal_lahir}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nama Orang Tua"
              name="nama_orang_tua"
              value={formData.nama_orang_tua}
              onChange={handleFormChange}
              required
              error={formErrors.nama_orang_tua}
            />
            <FormField
              label="Nomor Telepon"
              name="nomor_telepon"
              type="tel"
              value={formData.nomor_telepon}
              onChange={handleFormChange}
              required
              error={formErrors.nomor_telepon}
            />
          </div>

          <FormField
            label="Keluhan Orang Tua"
            name="keluhan_ortu"
            value={formData.keluhan_ortu}
            onChange={handleFormChange}
            rows={2}
          />

          {/* Riwayat Checkboxes */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Riwayat Kesehatan Anak
            </h4>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Dalam Kandungan</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {RIWAYAT_KANDUNGAN_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.riwayat_kandungan.includes(opt)}
                      onChange={() => handleCheckboxToggle("riwayat_kandungan", opt)}
                      className="rounded border-slate-300 text-emerald-600"
                    />
                    <span className="text-[11px] text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-slate-600">Saat Dilahirkan</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {RIWAYAT_SAAT_LAHIR_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.riwayat_saat_lahir.includes(opt)}
                      onChange={() => handleCheckboxToggle("riwayat_saat_lahir", opt)}
                      className="rounded border-slate-300 text-emerald-600"
                    />
                    <span className="text-[11px] text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-60"
            >
              {actionLoading ? "Menyimpan..." : "Simpan Profil Anak"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DETAIL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Rekam Medis Anak"
        maxWidth="max-w-2xl"
      >
        {selectedProfile && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium">Nama Lengkap</span>
                <p className="font-bold text-slate-800 text-sm">{selectedProfile.nama_lengkap}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Panggilan / JK</span>
                <p className="font-bold text-slate-800 text-sm">
                  {selectedProfile.nama_panggilan} ({selectedProfile.jenis_kelamin === "P" ? "P" : "L"})
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">TTL / Usia</span>
                <p className="font-bold text-slate-800">
                  {selectedProfile.tanggal_lahir?.split("T")[0]} ({selectedProfile.usia_bulan} Bulan)
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Orang Tua / Telp</span>
                <p className="font-bold text-slate-800">
                  {selectedProfile.nama_orang_tua} ({selectedProfile.nomor_telepon})
                </p>
              </div>
            </div>

            {selectedProfile.keluhan_ortu && (
              <div className="rounded-xl bg-amber-50 p-3 text-amber-900 border border-amber-100">
                <span className="font-bold">Keluhan:</span> {selectedProfile.keluhan_ortu}
              </div>
            )}

            {/* Skrining Terakhir */}
            <div className="space-y-3 pt-2">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Status Skrining Terakhir
              </h5>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-200 p-3 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold">KOMUNIKASI</span>
                  <p className="font-bold text-slate-800 mt-1">
                    {selectedProfile.latest_communication?.score ? `${selectedProfile.latest_communication.score}%` : "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold">MOTORIK</span>
                  <p className="font-bold text-slate-800 mt-1">
                    {selectedProfile.latest_motor?.score ? `${selectedProfile.latest_motor.score}%` : "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold">STATUS GIZI</span>
                  <p className="font-bold text-slate-800 mt-1">
                    {selectedProfile.latest_nutrition?.status_keseluruhan || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Profil Anak"
        message={`Apakah Anda yakin ingin menghapus data "${selectedProfile?.nama_lengkap}"? Seluruh data riwayat dan hasil skrining anak ini akan ikut terhapus.`}
        loading={actionLoading}
      />
    </div>
  );
}

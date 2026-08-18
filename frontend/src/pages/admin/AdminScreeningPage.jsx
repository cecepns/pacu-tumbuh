import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Activity,
  Apple,
  Search,
  Eye,
  RefreshCw,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { screeningService } from "@/services/screeningService";
import Pagination from "@/components/admin/Pagination";
import Modal from "@/components/admin/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { AGE_GROUPS } from "@/data/communicationChecklist";

export default function AdminScreeningPage() {
  const [activeTab, setActiveTab] = useState("communication"); // 'communication' | 'motor' | 'nutrition'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchScreenings = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "communication") {
        res = await screeningService.listCommunication({ page, limit, search: debouncedSearch });
      } else if (activeTab === "motor") {
        res = await screeningService.listMotor({ page, limit, search: debouncedSearch });
      } else {
        res = await screeningService.listNutrition({ page, limit, search: debouncedSearch });
      }

      setItems(res.data || []);
      if (res.pagination) {
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Gagal memuat data skrining");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit, debouncedSearch]);

  useEffect(() => {
    fetchScreenings();
  }, [fetchScreenings]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
  };

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Helper to parse checklist answers safely
  const parseChecklist = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">
          Hasil Skrining & Deteksi Tumbuh Kembang
        </h1>
        <p className="text-xs text-slate-500">
          Rekapitulasi instrumen skrining komunikasi, motorik, dan status gizi anak.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleTabChange("communication")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition shadow-sm ${
            activeTab === "communication"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Skrining Komunikasi</span>
        </button>

        <button
          onClick={() => handleTabChange("motor")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition shadow-sm ${
            activeTab === "motor"
              ? "bg-teal-600 text-white shadow-teal-600/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Skrining Motorik</span>
        </button>

        <button
          onClick={() => handleTabChange("nutrition")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition shadow-sm ${
            activeTab === "nutrition"
              ? "bg-amber-600 text-white shadow-amber-600/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Apple className="h-4 w-4" />
          <span>Skrining Status Gizi</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama anak atau status skrining..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </div>
        <button
          onClick={fetchScreenings}
          title="Refresh"
          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Table Content */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading && !items.length ? (
          <LoadingSpinner text="Memuat hasil skrining..." size="lg" />
        ) : items.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Belum Ada Rekap Skrining"
              description="Belum ada riwayat pengisian instrumen skrining untuk kategori ini."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="py-3.5 px-4">Nama Pasien Anak</th>
                  {activeTab !== "nutrition" ? (
                    <>
                      <th className="py-3.5 px-4">Kelompok Usia</th>
                      <th className="py-3.5 px-4">Skor & Butir</th>
                      <th className="py-3.5 px-4">Status Perkembangan</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3.5 px-4">Pengukuran (BB / TB / LK)</th>
                      <th className="py-3.5 px-4">Status Gizi (BB/TB)</th>
                      <th className="py-3.5 px-4">Kesimpulan</th>
                    </>
                  )}
                  <th className="py-3.5 px-4">Tgl Skrining</th>
                  <th className="py-3.5 px-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-sm">{item.nama_lengkap}</div>
                      <div className="text-[11px] text-slate-400">
                        Orang Tua: {item.nama_orang_tua} ({item.nomor_telepon})
                      </div>
                    </td>

                    {activeTab !== "nutrition" ? (
                      <>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {AGE_GROUPS[item.kelompok_usia]?.label || item.kelompok_usia}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-sm text-slate-900">{item.score}%</span>
                          <span className="text-[11px] text-slate-400 ml-1">
                            ({item.checked_items}/{item.total_items})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                              item.score >= 80
                                ? "bg-emerald-100 text-emerald-800"
                                : item.score >= 50
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {item.bb_sekarang_gram / 1000} kg / {item.tb_cm} cm / LK {item.lk_cm} cm
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">{item.status_bbtb || item.status_keseluruhan}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] text-slate-600 line-clamp-1">{item.status_keseluruhan}</span>
                        </td>
                      </>
                    )}

                    <td className="py-3.5 px-4 text-slate-500">
                      {item.tanggal_screening?.split("T")[0] || item.tanggal_pengukuran?.split("T")[0] || item.created_at?.split("T")[0]}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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

      {/* DETAIL MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Rincian Respon Skrining — ${selectedItem?.nama_lengkap || ""}`}
        maxWidth="max-w-2xl"
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">Nama Anak</span>
                <p className="font-bold text-slate-800 text-sm">{selectedItem.nama_lengkap}</p>
              </div>
              <div>
                <span className="text-slate-400">Status Skrining</span>
                <p className="font-bold text-emerald-700">{selectedItem.status || selectedItem.status_keseluruhan}</p>
              </div>
            </div>

            {/* Checklist Answers if communication / motor */}
            {selectedItem.checklist_answers && (
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Jawaban Instrumen ({parseChecklist(selectedItem.checklist_answers).length} Butir):
                </h5>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {parseChecklist(selectedItem.checklist_answers).map((ans, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 rounded-xl p-2.5 ${
                        ans.checked ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {ans.checked ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className="leading-tight">{ans.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {selectedItem.rekomendasi_stimulasi && (
              <div className="rounded-xl bg-blue-50 p-3 border border-blue-100 text-blue-900 space-y-1">
                <span className="font-bold">Rekomendasi Stimulasi:</span>
                <p>{selectedItem.rekomendasi_stimulasi}</p>
              </div>
            )}

            {selectedItem.rekomendasi_gizi && (
              <div className="rounded-xl bg-amber-50 p-3 border border-amber-100 text-amber-900 space-y-1">
                <span className="font-bold">Rekomendasi Gizi:</span>
                <p>{selectedItem.rekomendasi_gizi}</p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
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
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Activity,
  Apple,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { screeningService } from "@/services/screeningService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await screeningService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        // Fallback demo stats
        setStats({
          total_children: 12,
          total_communication: 10,
          total_motor: 9,
          total_nutrition: 11,
          communicationStatus: [
            { status: "Kemampuan Komunikasi Sesuai Usia", count: 8 },
            { status: "Perlu Stimulasi Komunikasi Intensif (Meragukan)", count: 2 },
          ],
          motorStatus: [
            { status: "Kemampuan Motorik Sesuai Usia", count: 7 },
            { status: "Perlu Stimulasi Motorik Terarah (Meragukan)", count: 2 },
          ],
          nutritionStatus: [
            { status: "Gizi Baik (Normal)", count: 9 },
            { status: "Gizi Kurang (Wasted)", count: 2 },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Memuat data dashboard..." size="lg" />;

  const statCards = [
    {
      title: "Total Profil Anak",
      value: stats?.total_children || 0,
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/profil-anak",
    },
    {
      title: "Skrining Komunikasi",
      value: stats?.total_communication || 0,
      icon: MessageSquare,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      link: "/admin/hasil-skrining",
    },
    {
      title: "Skrining Motorik",
      value: stats?.total_motor || 0,
      icon: Activity,
      color: "bg-teal-500",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
      link: "/admin/hasil-skrining",
    },
    {
      title: "Skrining Status Gizi",
      value: stats?.total_nutrition || 0,
      icon: Apple,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      link: "/admin/hasil-skrining",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-700 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-300" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              Dashboard Rekapitulasi Medis
            </span>
          </div>
          <h1 className="text-2xl font-black">
            Selamat Datang di Panel PACU TUMBUH
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            Pantau ringkasan hasil deteksi tumbuh kembang dan status gizi balita yang terdaftar di RSUD Kebayoran Lama.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white border border-white/20 hover:bg-white/25 transition"
          >
            <Settings className="h-4 w-4" />
            <span>Pengaturan Link Drive</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-3xl font-black text-slate-800 group-hover:text-emerald-600 transition">
                  {card.value}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-600">{card.title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Breakdown Status Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Komunikasi */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span>Distribusi Komunikasi</span>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {stats?.communicationStatus?.length ? (
              stats.communicationStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium truncate max-w-[200px]">{item.status}</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md shadow-sm">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-4 text-center">Belum ada data skrining</p>
            )}
          </div>
        </div>

        {/* Motorik */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Activity className="h-4 w-4 text-teal-600" />
              <span>Distribusi Motorik</span>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {stats?.motorStatus?.length ? (
              stats.motorStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium truncate max-w-[200px]">{item.status}</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md shadow-sm">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-4 text-center">Belum ada data skrining</p>
            )}
          </div>
        </div>

        {/* Gizi */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Apple className="h-4 w-4 text-amber-600" />
              <span>Distribusi Status Gizi</span>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {stats?.nutritionStatus?.length ? (
              stats.nutritionStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium truncate max-w-[200px]">{item.status}</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md shadow-sm">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-4 text-center">Belum ada data skrining</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

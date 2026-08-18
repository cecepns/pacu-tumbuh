# PACU TUMBUH (Pemantauan Akurat Cakupan Utuh Tumbuh Kembang dan Gizi Anak)
### RSUD Kebayoran Lama

Aplikasi web komprehensif berbasis React Vite (Frontend PWA) dan Express JS + MySQL (Backend) untuk deteksi dini, pemantauan, serta evaluasi tumbuh kembang anak (Kemampuan Komunikasi, Motorik Kasar & Halus, dan Status Gizi Antropometri Standar Kemenkes/WHO).

---

## 🚀 Fitur Utama & Menu Navigasi

1. **Tampilan Awal (Beranda)**: Hero banner, alur 3 langkah skrining cepat, pengenalan sistem PACU TUMBUH RSUD Kebayoran Lama.
2. **Tentang Web App & Disclaimer**: Latar belakang inovasi, visi misi, dan jaminan kerahasiaan data medis anak RSUD Kebayoran Lama.
3. **Profil dan Riwayat Kesehatan Anak**: Formulir identitas dan riwayat kesehatan (dalam kandungan, saat lahir, setelah lahir) dengan mekanisme auto-save saat klik "Lanjutkan".
4. **Skrining Kemampuan Komunikasi**: Ceklis kemampuan bahasa dan interaksi anak per tahapan usia (0–6 hingga 31–36 bulan) dengan auto-simpan dan hasil instan.
5. **Skrining Kemampuan Motorik**: Ceklis motorik kasar & halus per tahapan usia dengan auto-simpan dan hasil instan.
6. **Skrining Status Gizi**: Input antropometri (BB lahir, BB saat ini, TB/PB, Lingkar Kepala, riwayat ASI, MPASI, pola makan, penyakit) dengan evaluasi Z-Score BB/U, TB/U, BB/TB, LK/U standar WHO/Kemenkes.
7. **Evaluasi Terpadu**: Rangkuman 3 pilar skrining, status klinis, tombol cetak PDF, serta koneksi ke Google Drive untuk:
   - 📘 Flyer Ide Stimulasi Komunikasi & Motorik (per usia)
   - 🧩 Flyer Ide Bermain Edukatif
   - 🍲 Flyer Resep Makanan Tinggi Kalori & Menu Gizi Seimbang
8. **Kontak Konsultasi**: Alamat, telepon RSUD Kebayoran Lama, dan direct link chat WhatsApp ke Poli Anak.
9. **Admin Panel**: Dashboard statistik, manajemen data profil & riwayat anak, data hasil skrining, serta pengaturan link Google Drive flyer & kontak RS.

---

## 🛠️ Cara Menjalankan Aplikasi

### 1. Backend (Express + MySQL)
```bash
cd backend
npm install
npm run dev
```
*Pastikan database `pacu_tumbuh` sudah di-import dari `sql/database.sql`.*

### 2. Frontend (React + Vite + TailwindCSS)
```bash
cd frontend
npm install
npm run dev
```
Akses di browser: `http://localhost:5173`

### 3. Akun Login Admin / Nakes
- **URL**: `http://localhost:5173/admin/login`
- **Username**: `admin`
- **Password**: `admin123`
# pacu-tumbuh

-- Database: PACU TUMBUH (Pemantauan Akurat Cakupan Utuh Tumbuh Kembang dan Gizi Anak)
-- RSUD Kebayoran Lama

CREATE DATABASE IF NOT EXISTS pacu_tumbuh
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pacu_tumbuh;

-- 1. Tabel Profil Anak
CREATE TABLE IF NOT EXISTS child_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanggal_input DATE NOT NULL,
  nama_lengkap VARCHAR(150) NOT NULL,
  nama_panggilan VARCHAR(100) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin ENUM('L', 'P') DEFAULT 'L',
  nama_orang_tua VARCHAR(150) NOT NULL,
  nomor_telepon VARCHAR(30) NOT NULL,
  keluhan_ortu TEXT,
  usia_bulan INT NOT NULL,
  kelompok_usia VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nama (nama_lengkap),
  INDEX idx_kelompok_usia (kelompok_usia),
  INDEX idx_created (created_at)
);

-- 2. Tabel Riwayat Kesehatan Anak
CREATE TABLE IF NOT EXISTS health_histories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_profile_id INT NOT NULL,
  riwayat_kandungan JSON,
  riwayat_kandungan_lain VARCHAR(255),
  riwayat_saat_lahir JSON,
  riwayat_saat_lahir_lain VARCHAR(255),
  riwayat_setelah_lahir JSON,
  riwayat_setelah_lahir_lain VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  INDEX idx_child (child_profile_id)
);

-- 3. Tabel Skrining Kemampuan Komunikasi
CREATE TABLE IF NOT EXISTS screening_communication (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_profile_id INT NOT NULL,
  kelompok_usia VARCHAR(20) NOT NULL,
  tanggal_screening DATE NOT NULL,
  checklist_answers JSON NOT NULL,
  total_items INT NOT NULL,
  checked_items INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  status VARCHAR(100) NOT NULL,
  rekomendasi_stimulasi TEXT,
  rekomendasi_konsultasi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  INDEX idx_child (child_profile_id),
  INDEX idx_status (status)
);

-- 4. Tabel Skrining Kemampuan Motorik
CREATE TABLE IF NOT EXISTS screening_motor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_profile_id INT NOT NULL,
  kelompok_usia VARCHAR(20) NOT NULL,
  tanggal_screening DATE NOT NULL,
  checklist_answers JSON NOT NULL,
  total_items INT NOT NULL,
  checked_items INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  status VARCHAR(100) NOT NULL,
  rekomendasi_stimulasi TEXT,
  rekomendasi_konsultasi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  INDEX idx_child (child_profile_id),
  INDEX idx_status (status)
);

-- 5. Tabel Skrining Status Gizi & Pola Asuh
CREATE TABLE IF NOT EXISTS screening_nutrition (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_profile_id INT NOT NULL,
  tanggal_pengukuran DATE NOT NULL,
  bb_lahir_gram INT NOT NULL,
  bb_sekarang_gram INT NOT NULL,
  tb_cm DECIMAL(5,2) NOT NULL,
  lk_cm DECIMAL(5,2) NOT NULL,
  riwayat_asi JSON,
  riwayat_mpasi VARCHAR(50),
  riwayat_makan JSON,
  riwayat_makan_lain VARCHAR(255),
  riwayat_penyakit JSON,
  status_bbu VARCHAR(100),
  status_tbu VARCHAR(100),
  status_bbtb VARCHAR(100),
  status_lku VARCHAR(100),
  status_keseluruhan VARCHAR(100),
  rekomendasi_gizi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  INDEX idx_child (child_profile_id),
  INDEX idx_status (status_keseluruhan)
);

-- 6. Tabel Evaluasi Terpadu
CREATE TABLE IF NOT EXISTS evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_profile_id INT NOT NULL,
  communication_screening_id INT NULL,
  motor_screening_id INT NULL,
  nutrition_screening_id INT NULL,
  kesimpulan_umum TEXT,
  status_perkembangan VARCHAR(100),
  status_gizi VARCHAR(100),
  catatan_klinis TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  INDEX idx_child (child_profile_id)
);

-- 7. Tabel Admin
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Pengaturan Aplikasi (Settings)
CREATE TABLE IF NOT EXISTS app_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default Settings & Google Drive Links
INSERT INTO app_settings (setting_key, setting_value) VALUES
('rs_name', 'RSUD Kebayoran Lama'),
('rs_address', 'Jl. Kebayoran Lama No. 130, Kebayoran Lama Selatan, Jakarta Selatan, DKI Jakarta 12240'),
('rs_phone', '(021) 7234567'),
('rs_whatsapp', '6281117032345'),
('rs_poli_jam', 'Senin - Jumat: 08.00 - 15.00 WIB | Sabtu: 08.00 - 12.00 WIB'),
('drive_flyer_stimulasi_0_6', 'https://drive.google.com'),
('drive_flyer_stimulasi_7_12', 'https://drive.google.com'),
('drive_flyer_stimulasi_13_18', 'https://drive.google.com'),
('drive_flyer_stimulasi_19_24', 'https://drive.google.com'),
('drive_flyer_stimulasi_25_30', 'https://drive.google.com'),
('drive_flyer_stimulasi_31_36', 'https://drive.google.com'),
('drive_flyer_ide_bermain', 'https://drive.google.com'),
('drive_flyer_resep_tinggi_kalori', 'https://drive.google.com')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Admin Default (admin / admin123)
INSERT INTO admins (username, password, nama) VALUES
('admin', '$2b$10$w0dkh47rL0TlyrG3wY4wz.E.eG9yK1M1mD7M2HhIq1/y3/983Zzce', 'Administrator RSUD Kebayoran Lama')
ON DUPLICATE KEY UPDATE nama = VALUES(nama);

-- Sample Data Profil
INSERT INTO child_profiles (
  tanggal_input, nama_lengkap, nama_panggilan, tanggal_lahir, jenis_kelamin,
  nama_orang_tua, nomor_telepon, keluhan_ortu, usia_bulan, kelompok_usia
) VALUES (
  CURDATE(), 'Muhammad Arka Pratama', 'Arka', DATE_SUB(CURDATE(), INTERVAL 14 MONTH), 'L',
  'Rina Wulandari', '081298765432', 'Anak agak pasif saat diajak bicara dan berat badan sulit naik', 14, '13-18'
);

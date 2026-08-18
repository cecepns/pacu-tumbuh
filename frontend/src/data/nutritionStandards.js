/**
 * Standar Antropometri Pertumbuhan Anak berdasarkan Standar Kemenkes RI / WHO
 */

// Estimasi median referensi WHO (0 - 36 Bulan)
const WHO_STANDARDS = {
  // Usia (bulan): { medianBB (kg), sdBB (kg), medianTB (cm), sdTB (cm), medianLK (cm), sdLK (cm) }
  0: { bb: 3.3, sdBB: 0.5, tb: 49.5, sdTB: 2.0, lk: 34.5, sdLK: 1.2 },
  1: { bb: 4.5, sdBB: 0.6, tb: 54.0, sdTB: 2.2, lk: 37.0, sdLK: 1.2 },
  2: { bb: 5.6, sdBB: 0.7, tb: 57.5, sdTB: 2.3, lk: 38.5, sdLK: 1.2 },
  3: { bb: 6.4, sdBB: 0.8, tb: 60.5, sdTB: 2.4, lk: 40.0, sdLK: 1.3 },
  4: { bb: 7.0, sdBB: 0.8, tb: 63.0, sdTB: 2.4, lk: 41.2, sdLK: 1.3 },
  5: { bb: 7.5, sdBB: 0.9, tb: 65.0, sdTB: 2.5, lk: 42.2, sdLK: 1.3 },
  6: { bb: 7.9, sdBB: 0.9, tb: 66.8, sdTB: 2.5, lk: 43.0, sdLK: 1.3 },
  7: { bb: 8.3, sdBB: 1.0, tb: 68.4, sdTB: 2.6, lk: 43.8, sdLK: 1.3 },
  8: { bb: 8.6, sdBB: 1.0, tb: 69.8, sdTB: 2.6, lk: 44.5, sdLK: 1.3 },
  9: { bb: 8.9, sdBB: 1.0, tb: 71.2, sdTB: 2.7, lk: 45.0, sdLK: 1.3 },
  10: { bb: 9.2, sdBB: 1.1, tb: 72.5, sdTB: 2.7, lk: 45.5, sdLK: 1.3 },
  11: { bb: 9.4, sdBB: 1.1, tb: 73.8, sdTB: 2.8, lk: 46.0, sdLK: 1.3 },
  12: { bb: 9.6, sdBB: 1.1, tb: 75.0, sdTB: 2.8, lk: 46.4, sdLK: 1.4 },
  15: { bb: 10.3, sdBB: 1.2, tb: 78.5, sdTB: 3.0, lk: 47.2, sdLK: 1.4 },
  18: { bb: 10.9, sdBB: 1.3, tb: 81.5, sdTB: 3.2, lk: 47.8, sdLK: 1.4 },
  21: { bb: 11.5, sdBB: 1.4, tb: 84.5, sdTB: 3.4, lk: 48.3, sdLK: 1.4 },
  24: { bb: 12.2, sdBB: 1.5, tb: 87.1, sdTB: 3.5, lk: 48.8, sdLK: 1.5 },
  27: { bb: 12.8, sdBB: 1.6, tb: 89.5, sdTB: 3.6, lk: 49.2, sdLK: 1.5 },
  30: { bb: 13.3, sdBB: 1.7, tb: 92.0, sdTB: 3.8, lk: 49.5, sdLK: 1.5 },
  33: { bb: 13.8, sdBB: 1.8, tb: 94.2, sdTB: 3.9, lk: 49.8, sdLK: 1.5 },
  36: { bb: 14.3, sdBB: 1.9, tb: 96.1, sdTB: 4.0, lk: 50.0, sdLK: 1.5 },
};

function getNearestRef(ageMonths) {
  const m = Math.min(36, Math.max(0, Math.round(ageMonths)));
  if (WHO_STANDARDS[m]) return WHO_STANDARDS[m];

  // Interpolate if between table entries
  const keys = Object.keys(WHO_STANDARDS).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < keys.length - 1; i++) {
    if (m >= keys[i] && m <= keys[i + 1]) {
      const k1 = keys[i];
      const k2 = keys[i + 1];
      const factor = (m - k1) / (k2 - k1);
      const r1 = WHO_STANDARDS[k1];
      const r2 = WHO_STANDARDS[k2];
      return {
        bb: r1.bb + (r2.bb - r1.bb) * factor,
        sdBB: r1.sdBB + (r2.sdBB - r1.sdBB) * factor,
        tb: r1.tb + (r2.tb - r1.tb) * factor,
        sdTB: r1.sdTB + (r2.sdTB - r1.sdTB) * factor,
        lk: r1.lk + (r2.lk - r1.lk) * factor,
        sdLK: r1.sdLK + (r2.sdLK - r1.sdLK) * factor,
      };
    }
  }
  return WHO_STANDARDS[36];
}

export function evaluateNutrition({
  ageMonths,
  bbGram,
  tbCm,
  lkCm,
  riwayatPenyakit = {},
  riwayatMakan = [],
}) {
  const bbKg = Number(bbGram) / 1000;
  const tb = Number(tbCm);
  const lk = Number(lkCm);
  const ref = getNearestRef(ageMonths);

  // 1. Z-Score BB/U (Berat Badan menurut Umur)
  const zBBU = (bbKg - ref.bb) / ref.sdBB;
  let statusBBU = "Berat Badan Normal";
  let bbuColor = "green";
  if (zBBU < -3) {
    statusBBU = "Berat Badan Sangat Kurang (Severely Underweight)";
    bbuColor = "red";
  } else if (zBBU < -2) {
    statusBBU = "Berat Badan Kurang (Underweight)";
    bbuColor = "yellow";
  } else if (zBBU > 1) {
    statusBBU = "Risiko Berat Badan Lebih";
    bbuColor = "yellow";
  }

  // 2. Z-Score TB/U (Tinggi Badan menurut Umur)
  const zTBU = (tb - ref.tb) / ref.sdTB;
  let statusTBU = "Tinggi Badan Normal";
  let tbuColor = "green";
  if (zTBU < -3) {
    statusTBU = "Sangat Pendek (Severely Stunted)";
    tbuColor = "red";
  } else if (zTBU < -2) {
    statusTBU = "Pendek (Stunted)";
    tbuColor = "yellow";
  } else if (zTBU > 3) {
    statusTBU = "Tinggi";
    tbuColor = "green";
  }

  // 3. Status Gizi BB/TB (Estimasi BMI / BB terhadap TB ideal)
  // Standard ideal weight for height approximation
  const idealBbForTb = (tb / 100) * (tb / 100) * 16.5; // mean BMI ~ 16.5
  const zBBTB = (bbKg - idealBbForTb) / (ref.sdBB || 1.2);
  let statusBBTB = "Gizi Baik (Normal)";
  let bbtbColor = "green";
  if (zBBTB < -3) {
    statusBBTB = "Gizi Buruk (Severely Wasted)";
    bbtbColor = "red";
  } else if (zBBTB < -2) {
    statusBBTB = "Gizi Kurang (Wasted)";
    bbtbColor = "yellow";
  } else if (zBBTB > 3) {
    statusBBTB = "Obesitas (Obese)";
    bbtbColor = "red";
  } else if (zBBTB > 2) {
    statusBBTB = "Gizi Lebih (Overweight)";
    bbtbColor = "yellow";
  } else if (zBBTB > 1) {
    statusBBTB = "Berisiko Gizi Lebih";
    bbtbColor = "yellow";
  }

  // 4. Lingkar Kepala (LK/U)
  const zLK = (lk - ref.lk) / ref.sdLK;
  let statusLKU = "Lingkar Kepala Normal (Normosefali)";
  let lkuColor = "green";
  if (zLK < -2) {
    statusLKU = "Mikrosefali (Kepala Kecil, < -2 SD)";
    lkuColor = "red";
  } else if (zLK > 2) {
    statusLKU = "Makrosefali (Kepala Besar, > +2 SD)";
    lkuColor = "yellow";
  }

  // Analisis Keseluruhan Status Gizi
  let statusKeseluruhan = "Status Gizi Baik & Pertumbuhan Optimal";
  let statusColor = "green";

  if (bbuColor === "red" || bbtbColor === "red" || tbuColor === "red" || lkuColor === "red") {
    statusKeseluruhan = "Perlu Intervensi Medis & Gizi Khusus (Gizi Buruk / Sangat Pendek / Gangguan LK)";
    statusColor = "red";
  } else if (bbuColor === "yellow" || bbtbColor === "yellow" || tbuColor === "yellow" || lkuColor === "yellow") {
    statusKeseluruhan = "Perlu Perbaikan Pola Makan & Pemantauan Ketat (Gizi Kurang / Berisiko)";
    statusColor = "yellow";
  }

  // Rekomendasi Gizi Spesifik
  const rekomendasi = [];
  if (statusColor === "green") {
    rekomendasi.push("Pertahankan pola makan gizi seimbang dengan prinsip 'Isi Piringku': karbohidrat, protein hewani berkualitas tinggi, sayur, buah, dan lemak sehat.");
    rekomendasi.push("Pastikan pemberian ASI / susu lanjutan dan asupan cairan anak mencukupi.");
    rekomendasi.push("Rutin timbang dan ukur tinggi badan setiap bulan di Posyandu atau Poli Anak RSUD Kebayoran Lama.");
  } else if (statusColor === "yellow") {
    rekomendasi.push("Tingkatkan asupan makanan kaya kalori dan protein hewani (daging ayam, telur, hati ayam, ikan, keju, santan/minyak sehat) pada setiap waktu makan.");
    rekomendasi.push("Terapkan feeding rules yang teratur dan atasi anak yang sedang Gerakan Tutup Mulut (GTM) dengan variasi menu tinggi kalori.");
    rekomendasi.push("Akses flyer Resep Makanan Tinggi Kalori di menu Evaluasi untuk panduan memasak.");
    rekomendasi.push("Konsultasikan ke Ahli Gizi / Poli Anak RSUD Kebayoran Lama jika berat badan tidak naik dalam 2 bulan berturut-turut.");
  } else {
    rekomendasi.push("Segera bawa anak ke Poli Anak & Klinik Gizi RSUD Kebayoran Lama untuk evaluasi medis menyeluruh.");
    rekomendasi.push("Dokter spesialis anak dan ahli gizi akan memberikan formula makanan padat energi (F100/PKMK) dan mengevaluasi faktor penyakit penyerta.");
    rekomendasi.push("Pantau tanda bahaya dehidrasi, lemas, dan nafsu makan secara berkala.");
  }

  return {
    bbKg: bbKg.toFixed(2),
    tbCm: tb.toFixed(1),
    lkCm: lk.toFixed(1),
    zBBU: zBBU.toFixed(2),
    zTBU: zTBU.toFixed(2),
    zBBTB: zBBTB.toFixed(2),
    zLK: zLK.toFixed(2),
    statusBBU,
    bbuColor,
    statusTBU,
    tbuColor,
    statusBBTB,
    bbtbColor,
    statusLKU,
    lkuColor,
    statusKeseluruhan,
    statusColor,
    rekomendasiGizi: rekomendasi.join(" "),
  };
}

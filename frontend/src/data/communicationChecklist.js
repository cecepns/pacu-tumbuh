export const AGE_GROUPS = {
  "0-6": {
    label: "0-6 Bulan",
    minMonths: 0,
    maxMonths: 6,
    driveKey: "drive_flyer_stimulasi_0_6",
  },
  "7-12": {
    label: "7-12 Bulan",
    minMonths: 7,
    maxMonths: 12,
    driveKey: "drive_flyer_stimulasi_7_12",
  },
  "13-18": {
    label: "13-18 Bulan",
    minMonths: 13,
    maxMonths: 18,
    driveKey: "drive_flyer_stimulasi_13_18",
  },
  "19-24": {
    label: "19-24 Bulan",
    minMonths: 19,
    maxMonths: 24,
    driveKey: "drive_flyer_stimulasi_19_24",
  },
  "25-30": {
    label: "25-30 Bulan",
    minMonths: 25,
    maxMonths: 30,
    driveKey: "drive_flyer_stimulasi_25_30",
  },
  "31-36": {
    label: "31-36 Bulan",
    minMonths: 31,
    maxMonths: 36,
    driveKey: "drive_flyer_stimulasi_31_36",
  },
};

export const COMMUNICATION_ITEMS = {
  "0-6": [
    "Mengeluarkan suara selain menangis",
    "Bereaksi terhadap suara keras",
    "Mengeluarkan suara seperti \"ooooh\" atau \"aaaaah\" (cooing)",
    "Membalas dengan suara saat diajak berkomunikasi",
    "Bergantian mengeluarkan suara saat diajak berinteraksi",
    "Meniup ludah (menjulurkan lidah lalu meniup)",
    "Mengeluarkan suara yang melengking atau bernada tinggi",
  ],
  "7-12": [
    "Mengeluarkan berbagai suara (contoh: “mamamama” dan “babababa”)",
    "Memanggil orang tua dengan sebutan (contoh: “mama”, “dada”)",
    "Mengucapkan 2–3 kata selain “mama” dan “papa”",
    "Meniru kata-kata yang sering didengar",
    "Memahami instruksi satu tahap (contoh: \"adek duduk!\")",
    "Mengenali kata sebagai simbol benda: (contoh: saat mendengar “kucing” menirukan “meong”)",
    "Memahami kata “tidak/jangan”",
  ],
  "13-18": [
    "Mengucapkan satu atau dua kata selain “mama” atau “dada” (contoh: \"la” untuk \"bola\")",
    "Mengucapkan tiga kata atau lebih selain “mama” atau “dada”",
    "Mengikuti instruksi satu tahap tanpa bantuan gesture",
    "Menoleh atau melihat ke benda yang familiar saat disebut",
  ],
  "19-24": [
    "Menunjuk gambar atau benda di buku saat ditanya (contoh: “Mana beruangnya?\")",
    "Mengucapkan minimal dua kata secara bersamaan (contoh: “mau susu” atau “lagi makan”)",
    "Menunjuk minimal dua bagian tubuh saat diminta (contoh: mata, hidung, dan kaki)",
    "Menggunakan 10–20 kata termasuk nama orang",
    "Menggabungkan dua kata (contoh: “ayah pergi”)",
    "Menirukan suara hewan yang dikenal (contoh: \"meongg\" untuk kucing)",
    "Memberikan mainan saat diminta",
    "Menggunakan kata (contoh: “lagi”) untuk menyatakan keinginan",
    "Mengambil benda dari ruangan lain saat diminta",
  ],
  "25-30": [
    "Mengucapkan sekitar 50 kata benda bermakna",
    "Mengucapkan dua kata atau lebih secara bersamaan dengan kata kerja (contoh: “anjing lari\")",
    "Menyebut nama benda pada buku saat ditunjuk dan ditanya, “Ini apa?”",
    "Menggunakan kata ganti seperti “aku”, “saya”, “punya aku”, atau “kita”",
    "Bermain sambil berbicara sendiri atau dengan boneka (mengoceh)",
    "Bertanya “apa itu?” dan “di mana?”",
    "Menggunakan kalimat negatif sederhana seperti “tidak mau”",
    "Memiliki sekitar 450 kosakata reseptif",
    "Menyebut nama depan dan menunjukkan usia dengan jari",
  ],
  "31-36": [
    "Berbicara dua arah dengan lawan bicara minimal dua kali timbal balik dalam percakapan",
    "Mengajukan pertanyaan seperti “siapa”, “apa” (contoh: \"makan apa?\")",
    "Menyebutkan aktivitas yang terlihat (contoh: “lari”, “makan”, atau “main”)",
    "Menyebutkan nama depan atau nama panggilan saat ditanya",
    "Berbicara cukup jelas sehingga sebagian besar orang dapat memahaminya (Kejelasan 75 %)",
    "Menggabungkan kata benda dan kata kerja (contoh: “mama tidur”)",
    "Memahami konsep waktu sederhana seperti “besok” atau “tadi malam”",
    "Suka mendengar cerita yang sama berulang kali",
    "Kadang mengatakan “tidak” padahal maksudnya “ya”",
    "Berbicara dengan anak lain maupun orang dewasa",
    "Menyelesaikan masalah dengan berbicara, bukan menangis atau memukul",
    "Menjawab pertanyaan “di mana”",
    "Menggunakan kalimat pendek seperti “mau lagi” atau “mau biskuit”",
    "Mengenal warna dan konsep besar-kecil secara sederhana",
  ],
};

export function calculateAgeInMonths(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

export function getAgeGroup(months) {
  if (months <= 6) return "0-6";
  if (months <= 12) return "7-12";
  if (months <= 18) return "13-18";
  if (months <= 24) return "19-24";
  if (months <= 30) return "25-30";
  if (months <= 36) return "31-36";
  return "31-36";
}

export function evaluateCommunication(checkedCount, totalCount) {
  const score = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (score >= 80) {
    return {
      score,
      status: "Kemampuan Komunikasi Sesuai Usia",
      statusColor: "green",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rekomendasi_stimulasi:
        "Kemampuan komunikasi anak berkembang optimal sesuai tahapan usia. Pertahankan stimulasi dengan membacakan buku cerita, bernyanyi bersama, dan mengajak anak aktif berkomunikasi dalam aktivitas sehari-hari.",
      rekomendasi_konsultasi:
        "Tidak diperlukan penanganan khusus. Lakukan pemantauan berkala setiap 3 bulan dan lanjutkan stimulasi di rumah.",
    };
  }

  if (score >= 50) {
    return {
      score,
      status: "Perlu Stimulasi Komunikasi Intensif (Meragukan)",
      statusColor: "yellow",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      rekomendasi_stimulasi:
        "Terdapat beberapa kemampuan komunikasi yang belum tercapai. Tingkatkan interaksi dua arah secara aktif, kurangi paparan gawai/screen time, ajak anak menunjuk dan menyebutkan nama objek, serta gunakan panduan stimulasi resmi dari flyer RSUD Kebayoran Lama.",
      rekomendasi_konsultasi:
        "Disarankan untuk melakukan evaluasi ulang dalam 2–4 minggu. Jika tidak ada kemajuan, jadwalkan konsultasi ke Poli Anak / Tumbuh Kembang RSUD Kebayoran Lama.",
    };
  }

  return {
    score,
    status: "Perlu Konsultasi Dokter Spesialis Anak Segera (Penyimpangan)",
    statusColor: "red",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    rekomendasi_stimulasi:
      "Perlu pendampingan khusus dan stimulasi wicara intensif setiap hari. Batasi screen time sepenuhnya dan perbanyak respon komunikasi aktif.",
    rekomendasi_konsultasi:
      "Segera hubungi dan daftarkan anak ke Poli Anak RSUD Kebayoran Lama untuk evaluasi mendalam serta penanganan intervensi dini oleh Tim Tumbuh Kembang.",
  };
}

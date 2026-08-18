export const MOTOR_ITEMS = {
  "0-6": [
    "Menahan kepala agar tetap tegak saat dalam posisi tengkurap",
    "Menggerakkan kedua lengan dan kedua kaki",
    "Membuka tangan untuk waktu yang singkat",
    "Menahan kepala dengan stabil tanpa dukungan saat anda menggendongnya",
    "Memegang mainan saat anda meletakkannya di tangannya",
    "Mengunakan lengannya untuk mengayun ke arah mainan",
    "Membawa tangannya ke arah mulut",
    "Mendorong tubuh ke atas dengan bertumpu pada siku/lengan bawah saat posisi tengkurap",
  ],
  "7-12": [
    "Berguling dari posisi tengkurap ke telentang",
    "Mendorong tubuh ke atas dengan lengan lurus saat posisi tengkurap",
    "Bertumpu pada tangan untuk menopang dirinya sendiri saat duduk",
    "Mencapai posisi duduk dengan sendirinya",
    "Memindahkan benda dari satu tangan ke tangannya yang lain",
    "Menggunakan jari untuk “meraup” makanan ke arah dirinya",
    "Duduk tanpa bantuan",
  ],
  "13-18": [
    "Menarik dirinya ke atas untuk berdiri",
    "Berjalan, dengan berpegangan pada furnitur",
    "Minum dari cangkir tanpa tutup, sambil anda memegangnya",
    "Mengambil benda-benda menggunakan ibu jari dan jari telunjuk, seperti potongan kecil makanan",
    "Mengambil beberapa langkah secara mandiri",
    "Menggunakan jari-jarinya untuk menyuapkan beberapa makanan",
  ],
  "19-24": [
    "Berjalan tanpa harus berpegangan pada siapapun atau apapun",
    "Mencoret-coret",
    "Minum dari cangkir tanpa tutup dan mungkin kadang-kadang tumpah",
    "Menyuapkan makanan ke dirinya sendiri dengan menggunakan jari-jarinya",
    "Mencoba menggunakan sendok",
    "Memanjat naik dan turun dari sofa atau kursi tanpa bantuan",
  ],
  "25-30": [
    "Menendang bola",
    "Berlari",
    "Berjalan (bukan memanjat) naik beberapa anak tangga dengan atau tanpa bantuan",
    "Makan dengan menggunakan sendok",
    "Menggunakan tangan untuk memutar benda, seperti memutar kenop pintu atau membuka tutup botol",
  ],
  "31-36": [
    "Merangkai benda bersama-sama, seperti manik-manik berukuran besar atau makaroni",
    "Memakai beberapa potong pakaian sendiri, seperti celana longgar atau jaket",
    "Menggunakan garpu",
    "Membuka beberapa pakaian sendiri, seperti celana yang longgar atau jaket yang terbuka kancing/risletingnya",
    "Melompat dari lantai menggunakan kedua kaki",
    "Membalik halaman buku, satu per satu",
  ],
};

export function evaluateMotor(checkedCount, totalCount) {
  const score = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (score >= 80) {
    return {
      score,
      status: "Kemampuan Motorik Sesuai Usia",
      statusColor: "green",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rekomendasi_stimulasi:
        "Kemampuan motorik kasar dan halus anak berkembang sesuai dengan usianya. Berikan ruang gerak yang aman, stimulasi aktivitas fisik seperti berjalan, melompat, meremas, menggenggam, dan bermain di luar ruangan bersama keluarga.",
      rekomendasi_konsultasi:
        "Perkembangan motorik baik. Lanjutkan pemantauan rutin posyandu/Poli Anak setiap bulan.",
    };
  }

  if (score >= 50) {
    return {
      score,
      status: "Perlu Stimulasi Motorik Terarah (Meragukan)",
      statusColor: "yellow",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      rekomendasi_stimulasi:
        "Beberapa gerak motorik kasar/halus belum optimal. Ajak anak melakukan latihan koordinasi gerak secara teratur (misalnya melatih kekuatan otot leher/tungkai, latihan meraih benda, atau berjalan bertahap). Unduh materi panduan ide bermain motorik dari flyer resmi.",
      rekomendasi_konsultasi:
        "Lakukan stimulasi selama 2 minggu, evaluasi kembali. Bila belum ada peningkatan, konsultasikan ke tenaga fisioterapi / Poli Tumbuh Kembang RSUD Kebayoran Lama.",
    };
  }

  return {
    score,
    status: "Perlu Konsultasi Dokter Spesialis Anak Segera (Penyimpangan Motorik)",
    statusColor: "red",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    rekomendasi_stimulasi:
      "Perlu pendampingan khusus dan stimulasi motorik terstruktur di bawah bimbingan tenaga medis.",
    rekomendasi_konsultasi:
      "Segera periksakan anak ke Poli Anak / Rehabilitasi Medik RSUD Kebayoran Lama untuk evaluasi tonus otot, refleks, dan milestone motorik secara menyeluruh.",
  };
}

# 📘 Panduan Pengguna — Dashboard Outcome Based Education (OBE)

Panduan ini ditujukan untuk dosen dan admin akademik yang menggunakan dashboard OBE untuk mengelola penilaian dan pemantauan hasil pembelajaran.

---

## 🏠 Halaman Utama (Class Overview)

- Menampilkan semua kelas yang Anda ampu.
- Setiap kartu kelas berisi:
  - Nama mata kuliah
  - Jumlah mahasiswa
  - Progress berdasarkan bab/modul

🔗 Klik pada kartu kelas untuk melihat rincian bab dan nilai mahasiswa.

---

## 📚 Tampilan Nilai per Bab

- Menampilkan daftar bab dalam mata kuliah
- Di setiap bab:
  - Masukkan dan edit nilai komponen seperti tugas, kuis, UTS, UAS
  - Persentase bobot bisa berbeda di tiap kelas

📊 Perhitungan nilai akhir:
- Nilai akhir = ∑(nilai_komponen × bobot_komponen)
- Nilai akan dinormalisasi sebelum dihitung

---

## 📈 Analitik Mahasiswa

- Lihat distribusi nilai
- Identifikasi mahasiswa dengan performa rendah
- Ekspor laporan ke CSV / PDF (fitur ini dalam pengembangan)

---

## 🔐 Hak Akses

| Peran   | Akses yang Dimiliki                           |
|---------|-----------------------------------------------|
| Dosen   | Kelola kelas dan nilai sendiri                |
| Admin   | Kelola seluruh data mata kuliah dan laporan   |

---

## 💡 Tips

- Gunakan `Ctrl + F` di browser untuk mencari mahasiswa.
- Perubahan nilai akan disimpan otomatis.
- Validasi nilai dilakukan sebelum data dikirim ke server.

---

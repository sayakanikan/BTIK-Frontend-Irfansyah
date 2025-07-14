# 🧩 Penjelasan Solusi Teknis — Dashboard OBE

Dokumen ini menjelaskan keputusan arsitektural, struktur data, dan alasan teknis yang diambil dalam membangun aplikasi Outcome Based Education (OBE).

---

## 🏗️ Arsitektur Proyek

- **Framework**: Next.js (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS + Material UI
- **State Management**: React Context
- **Desain Sistem**: MUI dengan kustomisasi Tailwind

---

## 📁 Struktur Folder

```txt
src/
│
├── app/           # Routing dan halaman utama
├── components/    # Komponen UI reusable
├── lib/           # Fungsi helper seperti kalkulasi nilai
├── types/         # Definisi tipe TypeScript
├── hooks/         # Hook React kustom

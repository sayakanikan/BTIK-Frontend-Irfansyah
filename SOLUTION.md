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

## 👀 Requirement proyek

1. Dosen bisa menginputkan konfigurasi nilai tiap kelas yang diampunya
2. Dosen bisa menginputkan nilai tiap mahasiswa berdasarkan konfigurasi bobot nilai pada tiap komponen, dan bab nya
3. Dosen bisa melihat rekap nilai dari mahasiswa yang sudah diinputkan nilainya 

---

## 📁 Solusi Struktur Data

```bash
export type ClassCourse = {
  id: number;
  name: string;
  semester: string;
  studentCount: number;
  configCompleted: boolean;
  inputProgress: number;
  chapterCount: number;
  components: GradeComponent[];
};

export type GradeComponent = {
  id: number;
  name: "Tugas" | "UTS" | "UAS" | "Kuis" | "Proyek";
  weight: number;
  contributions: number[];
};

export type Student = {
  id: number;
  name: string;
  nim: string;
  class_id: number;
  grade: StudentGrade[];
};

export type StudentGrade = {
  studentId: number;
  grades: {
    [componentId: string]: {
      [chapterIndex: number]: number;
    };
  };
  finalScore: number;
};

export type GradeSummary = {
  student: Student;
  componentScores: Record<string, number>;
  finalScore: number;
  letterGrade: "A" | "B" | "C" | "D" | "E";
};

```

### Penjelasan solusi struktur data

Struktur data tersebut memiliki kemampuan untuk mengelola kelas, konfigurasi nilai tiap kelas, dan mengelola nilai yang dimiliki mahasiswa di tiap kelas tersebut. Data yang digunakan pada aplikasi merupakan dummy data yang digenerate di folder ``/app/data``, dan dikelola menggunakan context dari react.
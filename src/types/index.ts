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

// export type ImportResult = {
//   successCount: number;
//   failedCount: number;
//   errors: {
//     row: number;
//     message: string;
//   }[];
// };

// export type ExportOptions = {
//   format: "xlsx" | "csv" | "pdf";
//   includeSummary: boolean;
//   selectedClassId: string;
// };

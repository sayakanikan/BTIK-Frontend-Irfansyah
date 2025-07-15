type ClassCourse = {
  id: number;
  name: string;
  semester: string;
  studentCount: number;
  configCompleted: boolean;
  inputProgress: number;
  chapterCount: number;
  components: GradeComponent[];
};

type GradeComponent = {
  id: number;
  name: "Tugas" | "UTS" | "UAS" | "Kuis" | "Proyek";
  weight: number;
  contributions: number[];
};

type Student = {
  id: string;
  name: string;
  nim: string;
};

type StudentGrade = {
  studentId: string;
  grades: {
    [componentId: string]: {
      [chapterName: string]: number;
    };
  };
  finalScore: number;
};

type GradeSummary = {
  student: Student;
  componentScores: Record<string, number>;
  finalScore: number;
  letterGrade: "A" | "B" | "C" | "D" | "E";
};

type ImportResult = {
  successCount: number;
  failedCount: number;
  errors: {
    row: number;
    message: string;
  }[];
};

type ExportOptions = {
  format: "xlsx" | "csv" | "pdf";
  includeSummary: boolean;
  selectedClassId: string;
};

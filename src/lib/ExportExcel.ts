import * as XLSX from "xlsx";
import { Student, StudentGrade, GradeComponent } from "@/types";
import { getLetterGrade } from "./LetterGrade";

export function exportToExcel(
  students: Student[],
  studentGrades: StudentGrade[],
  components: GradeComponent[],
  chapterCount: number
) {
  const worksheetData: (string | number)[][] = [];

  const headerRow1 = ["Nama", "NIM"];
  components.forEach((comp) => {
    for (let i = 0; i < chapterCount; i++) {
      headerRow1.push(i === 0 ? comp.name : "");
    }
  });
  headerRow1.push("Nilai Akhir", "Grade");
  worksheetData.push(headerRow1);

  const headerRow2 = ["", ""];
  components.forEach(() => {
    for (let i = 1; i <= chapterCount; i++) {
      headerRow2.push(`Bab ${i}`);
    }
  });
  headerRow2.push("", "");
  worksheetData.push(headerRow2);

  students.forEach((student) => {
    const row: (string | number)[] = [student.name, student.nim];

    const sg = studentGrades.find((g) => g.studentId === student.id);

    components.forEach((comp) => {
      for (let chapterIndex = 1; chapterIndex <= chapterCount; chapterIndex++) {
        const score = sg?.grades?.[comp.id]?.[chapterIndex] ?? "";
        row.push(score);
      }
    });

    const finalScore = sg?.finalScore ?? "";
    const letterGrade = typeof finalScore === "number" ? getLetterGrade(finalScore) : "";

    row.push(finalScore, letterGrade);

    worksheetData.push(row);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const merges: XLSX.Range[] = [];

  let col = 2;
  components.forEach(() => {
    merges.push({
      s: { r: 0, c: col },
      e: { r: 0, c: col + chapterCount - 1 },
    });
    col += chapterCount;
  });

  merges.push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } });
  merges.push({ s: { r: 0, c: 1 }, e: { r: 1, c: 1 } });

  const finalScoreColIndex = 2 + components.length * chapterCount;
  merges.push({
    s: { r: 0, c: finalScoreColIndex },
    e: { r: 1, c: finalScoreColIndex },
  });
  merges.push({
    s: { r: 0, c: finalScoreColIndex + 1 },
    e: { r: 1, c: finalScoreColIndex + 1 },
  });

  worksheet["!merges"] = merges;

  const borderStyle = {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  };

  Object.keys(worksheet).forEach((cell) => {
    if (!cell.startsWith("!")) {
      worksheet[cell].s = {
        border: borderStyle,
        alignment: { vertical: "center", horizontal: "center", wrapText: true },
        font: { name: "Calibri", sz: 11 },
      };
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Nilai");

  XLSX.writeFile(workbook, "Rekap_Nilai.xlsx");
}

import { GradeSummary } from "@/types";

export const getLetterGrade = (score: number): GradeSummary["letterGrade"] => {
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "E";
};
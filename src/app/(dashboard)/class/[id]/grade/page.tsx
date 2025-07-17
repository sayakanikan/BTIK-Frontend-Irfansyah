"use client";

import BackButton from "@/components/button/BackButton";
import { useClassContext } from "@/context/ClassContext";
import { studentData, studentGradeData } from "@/data/studentData";
import { Box, Button, Card, Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getLetterGrade } from "@/lib/LetterGrade";
import { GradeSummary, StudentGrade } from "@/types";

const Grade = () => {
  const router = useRouter();
  const { id } = useParams();
  const { classes, updateClass } = useClassContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [gradeSummaries, setGradeSummaries] = useState<GradeSummary[]>([]);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const classData = useMemo(() => classes.find((cls) => cls.id === Number(id)), [classes, id]);
  const students = useMemo(() => {
    return studentData.filter((student) => student.class_id === Number(id)).filter((student) => (searchQuery.trim() === "" ? true : (student.name + student.nim).toLowerCase().includes(searchQuery.toLowerCase())));
  }, [id, searchQuery]);
  const components = useMemo(() => classData?.components ?? [], [classData]);

  const chapterCount = classData?.chapterCount ?? 5;

  const studentGradesMap = useMemo(() => {
    const map: Record<number, StudentGrade> = {};
    studentGrades.forEach((sg) => {
      map[sg.studentId] = sg;
    });
    return map;
  }, [studentGrades]);

  useEffect(() => {
    if (!classData || isInitialized) return;
  
    const initialStudentIds = studentData
      .filter((student) => student.class_id === Number(id))
      .map((s) => s.id);
  
    const existingGrades = studentGradeData.filter((g) =>
      initialStudentIds.includes(g.studentId)
    );
  
    setStudentGrades(existingGrades);
    setIsInitialized(true);
  }, [classData, id, isInitialized]);

  const handleChange = (studentId: number, componentId: number, chapterIndex: number, value: number) => {
    setStudentGrades((prev) => {
      const existing = prev.find((g) => g.studentId === studentId);
      if (!existing) {
        return [
          ...prev,
          {
            studentId,
            grades: {
              [componentId]: {
                [chapterIndex]: value,
              },
            },
            finalScore: 0,
          },
        ];
      }

      const updatedGrades = {
        ...existing.grades,
        [componentId]: {
          ...(existing.grades[componentId] || {}),
          [chapterIndex]: value,
        },
      };

      return prev.map((g) => (g.studentId === studentId ? { ...g, grades: updatedGrades } : g));
    });
  };

  useEffect(() => {
    if (!classData || students.length === 0 || studentGrades.length === 0) {
      setGradeSummaries([]);
      return;
    }

    const summaries: GradeSummary[] = studentGrades.map((sg) => {
      const student = students.find((s) => s.id === sg.studentId)!;
      const componentScores: Record<string, number> = {};
      let totalWeightedScore = 0;

      classData.components.forEach((comp) => {
        const chapterGrades = sg.grades[comp.id] || {};
        let componentScore = 0;

        comp.contributions.forEach((pct, babIdx) => {
          const chapterIndex = babIdx + 1;
          const score = chapterGrades[chapterIndex];

          if (typeof score === "number") {
            const weighted = (comp.weight / 100) * (pct / 100) * score;
            componentScore += weighted;
          }
        });

        componentScores[comp.name] = Number(componentScore.toFixed(2));
        totalWeightedScore += componentScore;
      });

      const finalScore = Math.round(totalWeightedScore);
      const letterGrade = getLetterGrade(finalScore);

      return {
        student,
        componentScores,
        finalScore,
        letterGrade,
      };
    });

    setGradeSummaries(summaries);
  }, [classData, students, studentGrades]);

  const inputProgress = classData?.inputProgress ?? 0;
  const classId = classData?.id ?? 0;

  useEffect(() => {
    if (!classId) return;

    const totalStudents = students.length;
    const totalComponents = classData!.components.length;
    const totalChapters = classData!.chapterCount || 1;
    const totalRequiredInputs = totalStudents * totalComponents * totalChapters;

    let filled = 0;

    studentGrades.forEach((sg) => {
      Object.values(sg.grades).forEach((chapterMap) => {
        filled += Object.keys(chapterMap).length;
      });
    });

    const progress = Math.round((filled / totalRequiredInputs) * 100);

    if (progress !== inputProgress && classId) {
      updateClass(classId, { inputProgress: progress });
    }
  }, [studentGrades, students.length, inputProgress, classId, updateClass, classData]);

  const handleSubmit = () => {
    studentGrades.forEach((sg) => {
      const existingIndex = studentGradeData.findIndex((d) => d.studentId === sg.studentId);
      if (existingIndex !== -1) {
        studentGradeData[existingIndex] = sg;
      } else {
        studentGradeData.push(sg);
      }
    });

    router.push("/class");
  };

  return (
    <Box className="space-y-6 px-4 py-6 max-w-full">
      <Box className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <Typography variant="h5" fontWeight={600}>
            Input Nilai Mahasiswa
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {classData?.name} – Semester {classData?.semester}
          </Typography>
        </div>
        <BackButton />
      </Box>

      <Card elevation={2} sx={{ p: 3, borderRadius: 3 }} className="max-w-[1070px]">
        <Box className="overflow-auto">
          <Button
            variant="outlined"
            onClick={() => setIsOpenFilter(!isOpenFilter)}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 500,
              fontSize: 12,
              marginBottom: 2,
              color: "primary.main",
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main",
                borderColor: "primary.main",
                color: "white",
              },
            }}
          >
            <FilterAltIcon />
          </Button>
          {/* Filter section */}
          <Collapse in={isOpenFilter}>
            <div className="border border-gray-200 rounded-md p-4 mt-2 mb-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Cari Nama/NIM" size="small" fullWidth value={tempSearchQuery} onChange={(e) => setTempSearchQuery(e.target.value)} />

              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none", borderRadius: 2 }}
                  fullWidth
                  onClick={() => {
                    setSearchQuery(tempSearchQuery);
                  }}
                >
                  Terapkan
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: "none", borderRadius: 2 }}
                  fullWidth
                  onClick={() => {
                    setTempSearchQuery("");
                    setSearchQuery("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Collapse>

          {students.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }} className="text-center">
              Tidak ada mahasiswa dalam kelas ini.
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ minWidth: "100%", overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell rowSpan={2} sx={{ border: 1, fontWeight: "bold", whiteSpace: "nowrap" }}>
                        Nama
                      </TableCell>
                      <TableCell rowSpan={2} sx={{ border: 1, fontWeight: "bold", whiteSpace: "nowrap" }}>
                        NIM
                      </TableCell>
                      {components.map((comp) => (
                        <TableCell key={comp.id} align="center" colSpan={chapterCount} sx={{ border: 1, fontWeight: "bold", whiteSpace: "nowrap" }}>
                          {comp.name}
                        </TableCell>
                      ))}
                      <TableCell rowSpan={2} align="center" sx={{ border: 1, fontWeight: "bold", whiteSpace: "nowrap" }}>
                        Nilai Akhir
                      </TableCell>
                      <TableCell rowSpan={2} align="center" sx={{ border: 1, fontWeight: "bold", whiteSpace: "nowrap" }}>
                        Grade
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {components.map((comp) =>
                        [...Array(chapterCount)].map((_, i) => (
                          <TableCell
                            key={`${comp.name}-bab-${i + 1}`}
                            align="center"
                            sx={{
                              borderTop: 1,
                              borderBottom: 1,
                              borderLeft: i === 0 ? "2px solid #888" : "none",
                              whiteSpace: "nowrap",
                              backgroundColor: "#fafafa",
                            }}
                          >
                            Bab {i + 1}
                          </TableCell>
                        ))
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {students.map((student) => {
                      const summary = gradeSummaries.find((g) => g.student.id === student.id);

                      return (
                        <TableRow key={student.id}>
                          <TableCell sx={{ border: 1, whiteSpace: "nowrap" }}>{student.name}</TableCell>
                          <TableCell sx={{ border: 1, whiteSpace: "nowrap" }}>{student.nim}</TableCell>
                          {components.map((comp) =>
                            [...Array(chapterCount)].map((_, i) => (
                              <TableCell
                                key={`${student.id}-${comp.id}-${i + 1}`}
                                sx={{
                                  borderTop: 1,
                                  borderBottom: 1,
                                  borderLeft: i === 0 ? "1px solid #888" : "none",
                                  minWidth: 90,
                                }}
                              >
                                <TextField size="small" type="number" fullWidth value={studentGradesMap[student.id]?.grades?.[comp.id]?.[i + 1] ?? ""} onChange={(e) => handleChange(student.id, comp.id, i + 1, Number(e.target.value))} />
                              </TableCell>
                            ))
                          )}
                          <TableCell sx={{ border: 1, textAlign: "center", fontWeight: 600 }}>{summary?.finalScore ?? "-"}</TableCell>
                          <TableCell sx={{ border: 1, textAlign: "center", fontWeight: 600 }}>{summary?.letterGrade ?? "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box className="flex justify-end gap-3 mt-6">
                <Button variant="outlined" sx={{ textTransform: "none", borderRadius: 2 }} onClick={handleSubmit}>
                  Submit Nilai
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default Grade;

"use client";

import BackButton from "@/components/button/BackButton";
import { useClassContext } from "@/context/ClassContext";
import { studentData, studentGradeData } from "@/data/studentData";
import { Box, Button, Card, Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getLetterGrade } from "@/lib/LetterGrade";
import { GradeSummary } from "@/types";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { exportToExcel } from "@/lib/ExportExcel";

const GradeRecap = () => {
  const { id } = useParams();
  const { classes } = useClassContext();
  const [gradeSummaries, setGradeSummaries] = useState<GradeSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const classData = useMemo(() => classes.find((cls) => cls.id === Number(id)), [classes, id]);
  const allStudents = useMemo(() => studentData.filter((s) => s.class_id === Number(id)), [id]);
  const chapterCount = classData?.chapterCount ?? 5;
  const components = classData?.components ?? [];

  const studentGrades = useMemo(() => {
    const ids = allStudents.map((s) => s.id);
    return studentGradeData.filter((g) => ids.includes(g.studentId));
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => (searchQuery.trim() === "" ? true : (student.name + student.nim).toLowerCase().includes(searchQuery.toLowerCase())));
  }, [allStudents, searchQuery]);

  useEffect(() => {
    if (!classData || studentGrades.length === 0) {
      setGradeSummaries([]);
      return;
    }

    const summaries: GradeSummary[] = studentGrades.map((sg) => {
      const student = allStudents.find((s) => s.id === sg.studentId)!;
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
  }, [classData, allStudents, studentGrades]);

  return (
    <Box className="space-y-6 px-4 py-6 max-w-full">
      <Box className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <Typography variant="h5" fontWeight={600}>
            Rekapitulasi Nilai Mahasiswa
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {classData?.name} – Semester {classData?.semester}
          </Typography>
        </div>
        <BackButton />
      </Box>

      <Card elevation={2} sx={{ p: 3, borderRadius: 3 }} className="max-w-[1070px]">
        <Box className="overflow-auto">
          <Box className="flex justify-between items-center mb-3">
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

            <Button
              variant="outlined"
              onClick={() => exportToExcel(filteredStudents, studentGrades, components, chapterCount)}
              sx={{ textTransform: "none", borderRadius: 2, color: "success.main", borderColor: "success.main" }}
              disabled={gradeSummaries.length === 0}
            >
              Export Excel
            </Button>
          </Box>

          <Collapse in={isOpenFilter}>
            <div className="border border-gray-200 rounded-md p-4 mt-2 mb-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Cari Nama/NIM" size="small" fullWidth value={tempSearchQuery} onChange={(e) => setTempSearchQuery(e.target.value)} />
              <div className="flex gap-2">
                <Button size="small" variant="contained" sx={{ textTransform: "none", borderRadius: 2 }} fullWidth onClick={() => setSearchQuery(tempSearchQuery)}>
                  Terapkan
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: "none", borderRadius: 2 }}
                  fullWidth
                  onClick={() => {
                    setSearchQuery("");
                    setTempSearchQuery("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Collapse>

          {gradeSummaries.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }} className="text-center">
              Tidak ada nilai yang tersedia.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell rowSpan={2} sx={{ border: 1, fontWeight: "bold" }}>
                      Nama
                    </TableCell>
                    <TableCell rowSpan={2} sx={{ border: 1, fontWeight: "bold" }}>
                      NIM
                    </TableCell>
                    {components.map((comp) => (
                      <TableCell key={comp.id} colSpan={chapterCount} align="center" sx={{ border: 1, fontWeight: "bold" }}>
                        {comp.name}
                      </TableCell>
                    ))}
                    <TableCell rowSpan={2} sx={{ border: 1, fontWeight: "bold", textAlign: "center" }}>
                      Nilai Akhir
                    </TableCell>
                    <TableCell rowSpan={2} sx={{ border: 1, fontWeight: "bold", textAlign: "center" }}>
                      Grade
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    {components.map((comp) =>
                      [...Array(chapterCount)].map((_, i) => (
                        <TableCell key={`${comp.id}-bab-${i + 1}`} align="center" sx={{ border: 1 }}>
                          Bab {i + 1}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {gradeSummaries
                    .filter((summary) => filteredStudents.some((s) => s.id === summary.student.id))
                    .map((summary) => (
                      <TableRow key={summary.student.id}>
                        <TableCell sx={{ border: 1 }}>{summary.student.name}</TableCell>
                        <TableCell sx={{ border: 1 }}>{summary.student.nim}</TableCell>
                        {components.map((comp) =>
                          [...Array(chapterCount)].map((_, i) => {
                            const score = studentGrades.find((g) => g.studentId === summary.student.id)?.grades?.[comp.id]?.[i + 1] ?? "-";
                            return (
                              <TableCell key={`${comp.id}-${i + 1}`} align="center" sx={{ border: 1 }}>
                                {score}
                              </TableCell>
                            );
                          })
                        )}
                        <TableCell align="center" sx={{ border: 1, fontWeight: 600 }}>
                          {summary.finalScore}
                        </TableCell>
                        <TableCell align="center" sx={{ border: 1, fontWeight: 600 }}>
                          {summary.letterGrade}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default GradeRecap;

"use client";

import { Card } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip } from "recharts";
import { Collapse, MenuItem, Select, TextField, InputLabel, FormControl } from "@mui/material";
import Link from "next/link";
import { useClassContext } from "@/context/ClassContext";
import { ClassCourse } from "@/types";

const Class = () => {
  const { classes } = useClassContext();
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSemester, setTempSemester] = useState<string>("");
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");

  const getProgressColor = (progress: number) => {
    if (progress < 75) return "#ef4444";
    if (progress < 100) return "#facc15";
    return "#00C951";
  };

  const filteredData = classes.filter((item) => {
    const matchSemester = filterSemester ? item.semester === filterSemester : true;
    const matchName = searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchSemester && matchName;
  });

  const grouped = filteredData.reduce<Record<string, ClassCourse[]>>((acc, curr) => {
    acc[curr.semester] = acc[curr.semester] || [];
    acc[curr.semester].push(curr);
    return acc;
  }, {});

  return (
    <>
      <div className={`flex flex-row h-10 w-full justify-between ${isOpenFilter ? "mb-0" : "mb-5"}`}>
        <h1 className="font-medium text-2xl">Dashboard Overview Kelas</h1>
        <Button
          variant="outlined"
          onClick={() => setIsOpenFilter(!isOpenFilter)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 500,
            fontSize: 12,
            color: "primary.main",
            borderColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.main",
              borderColor: "primary.main",
              color: "white",
            },
          }}
        >
          Filter
        </Button>
      </div>

      {/* Filter section */}
      <Collapse in={isOpenFilter}>
        <div className="border border-gray-200 rounded-md p-4 mt-2 mb-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormControl fullWidth size="small">
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select labelId="semester-label" label="Semester" value={tempSemester} onChange={(e) => setTempSemester(e.target.value)}>
              <MenuItem value="">Semua</MenuItem>
              <MenuItem value="Ganjil 2025">Ganjil 2025</MenuItem>
              <MenuItem value="Genap 2025">Genap 2025</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Cari Nama Kelas" size="small" fullWidth placeholder="Contoh: Pemrograman" value={tempSearchQuery} onChange={(e) => setTempSearchQuery(e.target.value)} />

          <div className="flex gap-2">
            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 2 }}
              fullWidth
              onClick={() => {
                setFilterSemester(tempSemester);
                setSearchQuery(tempSearchQuery);
              }}
            >
              Terapkan
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: 2 }}
              fullWidth
              onClick={() => {
                setTempSemester("");
                setFilterSemester("");
                setTempSearchQuery("");
                setSearchQuery("");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </Collapse>

      {Object.entries(grouped).map(([semester, classes]) => (
        <div key={semester} className="mb-10">
          <h2 className="text-lg font-semibold text-gray-400 mb-4 border-l-4 border-gray-400 px-2">Semester: {semester}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes && classes.length > 0 ? (
              classes.map((item) => (
                <Card
                  key={item.id}
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(0.98)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <div className="flex flex-row justify-between">
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">Jumlah Mahasiswa: {item.studentCount}</p>
                      <span className={`px-3 py-1 ${item.configCompleted ? "bg-green-500" : "bg-red-500"} text-white text-xs rounded-xl`}>{item.configCompleted ? "Nilai sudah dikonfigurasi" : "Butuh konfigurasi nilai"}</span>
                    </div>
                    <div className="w-24 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="70%"
                          outerRadius="100%"
                          barSize={10}
                          data={[{ name: "Progress", value: item.inputProgress, fill: getProgressColor(item.inputProgress) }]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar background dataKey="value" cornerRadius={10} />

                          <Tooltip formatter={() => ["Progress input nilai"]} contentStyle={{ fontSize: "12px", zIndex: "99999" }} />
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 font-semibold text-sm">
                            {item.inputProgress}%
                          </text>

                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between mt-3">
                    <Button
                      variant="outlined"
                      className="transition-all duration-200 active:scale-95 hover:shadow-md"
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      <Link href={`/class/${item.id}`}>Konfigurasi</Link>
                    </Button>
                    <Button
                      variant="outlined"
                      className="transition-all duration-200 active:scale-95 hover:shadow-md"
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                      disabled={!item.configCompleted}
                    >
                      <Link href={`/class/${item.id}/grade`}>Input Nilai</Link>
                    </Button>
                    <Button
                      variant="outlined"
                      className="transition-all duration-200 active:scale-95 hover:shadow-md"
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Lihat Rekap
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-sm text-gray-200">Data kelas tidak ditemukan.</p>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Class;

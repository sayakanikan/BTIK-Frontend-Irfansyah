"use client";

import BackButton from "@/components/button/BackButton";
import { useClassContext } from "@/context/ClassContext";
import { Alert, Box, Button, Card, Divider, Grid, Slider, TextField, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ClassDetail = () => {
  const { id } = useParams();
  const { classes, updateClass } = useClassContext();
  const router = useRouter();
  const classData = classes.find((cls) => cls.id === Number(id));
  const babCount = classData?.chapterCount ?? 3;
  const fixedComponents =
    classData?.components.map((comp) => ({
      ...comp,
      contributions: Array.from({ length: babCount }, (_, i) => comp.contributions[i] ?? 0),
    })) ?? [];
  const [components, setComponents] = useState(fixedComponents);
  const [sampleValues, setSampleValues] = useState(() => Array.from({ length: babCount }, () => 80));
  const [finalScore, setFinalScore] = useState<number>(0);
  const [babCountInput, setBabCountInput] = useState(sampleValues.length);
  const [saved, setSaved] = useState(false);

  const handleWeightChange = (index: number, weight: number) => {
    const newData = [...components];
    newData[index].weight = weight;
    setComponents(newData);
    setSaved(false);
  };

  const handleContributionChange = (compIdx: number, babIdx: number, value: number) => {
    const newData = [...components];
    newData[compIdx].contributions[babIdx] = value;
    setComponents(newData);
    setSaved(false);
  };

  const handleSampleChange = (babIdx: number, value: number) => {
    const newData = [...sampleValues];
    newData[babIdx] = value;
    setSampleValues(newData);
  };

  const getTotalWeight = () => components.reduce((acc, comp) => acc + comp.weight, 0);
  const getContribTotal = (compIdx: number) => components[compIdx].contributions.reduce((acc, val) => acc + val, 0);

  const isValid = () => {
    const totalWeightValid = getTotalWeight() === 100;
    const allContribValid = components.every((_, i) => getContribTotal(i) === 100);
    return totalWeightValid && allContribValid;
  };

  const calculateFinalScore = () => {
    if (!isValid()) return;
    let total = 0;
    components.forEach((comp) => {
      comp.contributions.forEach((pct, idx) => {
        total += (comp.weight / 100) * (pct / 100) * sampleValues[idx];
      });
    });
    setFinalScore(Number(total.toFixed(2)));
  };

  const saveConfiguration = () => {
    if (!classData) return;
    updateClass(classData.id, { components });
    setSaved(true);
    router.push("/class");
  };

  const handleUpdateBab = () => {
    const newCount = babCountInput;
    if (newCount < 1) return;

    const updatedComponents = components.map((comp) => {
      const current = comp.contributions;
      const newContrib = [...current];

      if (newCount > current.length) {
        for (let i = current.length; i < newCount; i++) {
          newContrib.push(0);
        }
      } else if (newCount < current.length) {
        newContrib.splice(newCount);
      }

      return {
        ...comp,
        contributions: newContrib,
      };
    });

    const updatedSample = [...sampleValues];
    if (newCount > sampleValues.length) {
      for (let i = sampleValues.length; i < newCount; i++) {
        updatedSample.push(80);
      }
    } else if (newCount < sampleValues.length) {
      updatedSample.splice(newCount);
    }

    setComponents(updatedComponents);
    setSampleValues(updatedSample);
  };

  useEffect(() => {
    const updatedClassData = classes.find((cls) => cls.id === Number(id));
    if (updatedClassData) {
      updatedClassData.configCompleted = true;
      updatedClassData.chapterCount = babCountInput;
      const updatedBabCount = updatedClassData.chapterCount ?? 3;
      const updatedComponents =
        updatedClassData.components.map((comp) => ({
          ...comp,
          contributions: Array.from({ length: updatedBabCount }, (_, i) => comp.contributions[i] ?? 0),
        })) ?? [];
      setComponents(updatedComponents);
    }
  }, [classes, id]);

  return (
    <Box className="space-y-5">
      <Box className="flex justify-between items-center mb-5">
        <div>
          <h1 className="font-semibold text-2xl">Konfigurasi Nilai</h1>
          <Typography variant="subtitle1" color="gray">
            {classData?.name} – Semester {classData?.semester}
          </Typography>
        </div>
        <BackButton />
      </Box>

      <Card sx={{ p: 4 }}>
        <Box className="flex justify-between items-end gap-4 mb-4">
          <Box>
            <Typography variant="h6">Jumlah Bab</Typography>
            <Typography variant="body2" color="text.secondary">
              Tentukan jumlah bab untuk kelas ini.
            </Typography>
          </Box>
          <Box className="flex items-end gap-2">
            <TextField label="Jumlah Bab" type="number" size="small" value={babCountInput} onChange={(e) => setBabCountInput(Number(e.target.value))} inputProps={{ min: 1 }} />
            <Button variant="contained" onClick={handleUpdateBab} sx={{ textTransform: "none", borderRadius: 2 }}>
              Update Bab
            </Button>
          </Box>
        </Box>
      </Card>

      {!isValid() && <Alert severity="error">Pastikan total bobot seluruh komponen = 100% dan total kontribusi per komponen = 100%</Alert>}

      <Card sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Komponen Nilai
        </Typography>

        {components.map((comp, i) => (
          <Box key={i} sx={{ mb: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {comp.name}
            </Typography>

            <Box className="flex items-center gap-4 mt-2 mb-3">
              <Typography variant="body2" sx={{ minWidth: 130 }}>
                Bobot Total (%)
              </Typography>
              <TextField
                size="small"
                type="number"
                value={comp.weight}
                onChange={(e) => {
                  const val: string = e.target.value;
                  handleWeightChange(i, val === "" ? 0 : parseInt(val));
                }}
                inputProps={{ min: 0, max: 100 }}
                sx={{ width: 100 }}
                error={getTotalWeight() !== 100}
              />
            </Box>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
              {comp.contributions.map((val, babIdx) => (
                <Box key={babIdx} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2, backgroundColor: "#fafafa" }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Kontribusi Bab {babIdx + 1} (%)
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    value={val}
                    onChange={(e) => {
                      const newVal: string = e.target.value;
                      handleContributionChange(i, babIdx, newVal === "" ? 0 : parseInt(newVal));
                    }}
                    inputProps={{ min: 0, max: 100 }}
                    error={getContribTotal(i) !== 100}
                    helperText={val < 0 || val > 100 ? "Nilai harus antara 0–100" : ""}
                  />
                </Box>
              ))}
            </div>

            <Typography variant="caption" color={getContribTotal(i) === 100 ? "success.main" : "error"}>
              Total kontribusi tiap Bab {comp.name}: {getContribTotal(i)}%
            </Typography>
          </Box>
        ))}

        <Divider sx={{ mb: 2 }} />
        <Box className="mt-5 flex flex-row justify-between gap-3">
          <p>Total bobot seluruh komponen: {getTotalWeight()}% </p>
          <Button variant="contained" onClick={saveConfiguration} disabled={!isValid()} sx={{ textTransform: "none", borderRadius: 2 }}>
            Simpan Konfigurasi
          </Button>
        </Box>
      </Card>

      <Card sx={{ p: 4 }}>
        <Typography variant="h6" className="mb-3">
          Nilai Sample
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {sampleValues.map((val, i) => (
            <div key={i}>
              <TextField fullWidth label={`Bab ${i + 1}`} type="number" size="small" value={val} onChange={(e) => handleSampleChange(i, parseInt(e.target.value))} inputProps={{ min: 0, max: 100 }} error={val < 0 || val > 100} />
            </div>
          ))}
        </Grid>

        <Box className="mt-5 flex gap-4 items-center">
          <Button variant="outlined" onClick={calculateFinalScore} disabled={!isValid()} sx={{ textTransform: "none", borderRadius: 2 }}>
            Hitung Nilai Akhir
          </Button>
          {finalScore !== null && (
            <Typography variant="h6">
              🎓 Nilai Akhir: <strong>{finalScore}</strong>
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ClassDetail;

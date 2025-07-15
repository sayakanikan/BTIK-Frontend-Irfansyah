"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outlined"
      startIcon={<ArrowBackIcon />}
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
          color: "white"
        },
      }}
    >
      Kembali
    </Button>
  );
};

export default BackButton;

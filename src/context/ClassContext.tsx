"use client";

import { classData } from "@/data/classData";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ClassContextType = {
  classes: ClassCourse[];
  updateClass: (id: number, updatedData: Partial<ClassCourse>) => void;
};

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const useClassContext = () => {
  const ctx = useContext(ClassContext);
  if (!ctx) throw new Error("useClassContext must be used within ClassProvider");
  return ctx;
};

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<ClassCourse[]>(classData);

  const updateClass = (id: number, updatedData: Partial<ClassCourse>) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, ...updatedData } : cls))
    );
  };

  return (
    <ClassContext.Provider value={{ classes, updateClass }}>
      {children}
    </ClassContext.Provider>
  );
};

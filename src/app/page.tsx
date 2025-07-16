import AppLayout from "@/layouts/AppLayout";
import { Box, Card } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionIcon from '@mui/icons-material/Description';
import { ReactNode } from "react";

type StatCard = {
  title: string;
  value: string;
  icon: ReactNode;
};

const stats: StatCard[] = [
  {
    title: "Total Kelas",
    value: "4",
    icon: <ClassIcon fontSize="large" />,
  },
  {
    title: "Kelas terkonfigurasi",
    value: "3 / 4",
    icon: <SettingsIcon fontSize="large" />,
  },
  {
    title: "Total Mahasiswa",
    value: "104",
    icon: <SchoolIcon fontSize="large" />,
  },
  {
    title: "Persentase Input Nilai",
    value: "20%",
    icon: <DescriptionIcon fontSize="large" />,
  },
];

export default function Home() {
  return (
    <AppLayout>
      <Box className="space-y-5">
        <Box className="flex justify-between items-center mb-5">
          <div>
            <h1 className="font-medium text-2xl">Dashboard - Selamat datang Irfansyah</h1>
          </div>
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <div className="flex flex-row items-center gap-4">
                {stat.icon}
                <div>
                  <p className="font-base text-md">{stat.title}</p>
                  <h3 className="font-medium text-3xl">{stat.value}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Box>
    </AppLayout>
  );
}

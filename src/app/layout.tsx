import type { Metadata } from "next";
import "./globals.css";
import { ClassProvider } from "@/context/ClassContext";

export const metadata: Metadata = {
  title: "Outcome Based Education",
  description: "OBE for BTIK Udinus made by Irfansyah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ClassProvider>
          {children}
        </ClassProvider>
      </body>
    </html>
  );
}

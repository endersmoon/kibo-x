import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kibo-X | Candidate Tracking System",
  description:
    "A modern candidate tracking system for managing job requisitions and hiring processes with kanban boards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/navigation";
import { JotaiProvider } from "@/components/providers/jotai-provider";
import { FirebaseProvider } from "@/components/firebase-provider";
import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";

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
        <JotaiProvider>
          <AuthProvider>
            <FirebaseProvider>
              <AuthGuard>
                <SidebarLayout>
                  {children}
                </SidebarLayout>
              </AuthGuard>
            </FirebaseProvider>
          </AuthProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}

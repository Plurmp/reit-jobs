import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ProfileDropdown from "@/components/ProfileDropdown";
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs, { ssr: true });

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AllTheREITJobs",
  description: "Every REIT job in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="max-w-10xl mx-auto min-h-screen bg-dallas-skyline bg-cover h-full">
          <Navbar>
            <ProfileDropdown/>
          </Navbar>
          {children}
        </main>
      </body>
    </html>
  );
}

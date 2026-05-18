import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GramScaling — Grow Your Instagram in the US",
  description: "We create your US TikTok account, tell you what to post every day, and post it automatically from a US device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{background:'#000',color:'#fff',margin:0,padding:0,minHeight:'100vh'}}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
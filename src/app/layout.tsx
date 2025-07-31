import type { Metadata } from "next";
import clsx from "clsx";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from '@clerk/localizations'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brasis",
  description: "Loja de velas aromáticas inspiradas na cultura brasileira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body
          className={clsx(`${geistSans.variable} ${geistMono.variable} antialiased`,'bg-slate-700')}
        >
          <Navbar/>
          <main className="h-screen p-16">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

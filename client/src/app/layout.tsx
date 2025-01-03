import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Toaster } from "sonner";
import { Suspense } from "react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans"
})

export const metadata: Metadata = {
  title: "BLU.edu",
  description: "Plataforma de gerenciamento de vídeos educativos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="en">
        <body
          className={`${dmSans.className}`}
        >
          <Providers>
            <Suspense fallback={null}>
              <div className="mx-auto w-full h-full justify-center items-center">
                {children}
              </div>
            </Suspense>
            <Toaster richColors closeButton />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

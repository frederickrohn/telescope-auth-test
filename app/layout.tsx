import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Telescope Auth Test",
  description: "Throwaway app for testing GitHub sign-in through Telescope",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col items-center justify-center bg-zinc-50 font-sans text-zinc-900">
        <ClerkProvider>
          <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}

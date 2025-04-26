import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-redhat",
});

export const metadata: Metadata = {
  title: "Legal Form Builder",
  description: "Crea documentos legales con variables dinámicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${redHat.className} ${redHat.variable} bg-gray-900`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

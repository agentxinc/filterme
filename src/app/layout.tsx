import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF Text Converter",
  description: "Convert PDF to Text and Text to PDF — fast, free, and private.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

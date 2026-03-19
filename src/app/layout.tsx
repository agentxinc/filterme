import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyLifeJourney - Your Personalized Life Storybook",
  description:
    "Create a beautiful personalized storybook from your life events. Add dates, photos, and memories to generate a printable slambook.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

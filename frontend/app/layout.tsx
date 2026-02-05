import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GenZ Manager",
  description: "Reviews, feedback, hike eligibility. Honest, slightly unhinged, lowkey useful.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

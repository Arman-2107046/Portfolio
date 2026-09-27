import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arman Rahman Rafi — Full-Stack Web Developer",
  description:
    "Full-stack web developer in Khulna, Bangladesh. One person owns the system from database to conversion event.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Miriam_Libre } from "next/font/google";
import "./globals.css";

const miriamLibre = Miriam_Libre({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-miriam-libre",
});

export const metadata: Metadata = {
  title: "Canvascraft",
  description: "Generate art with HTML Canvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={miriamLibre.variable}>
      <body>{children}</body>
    </html>
  );
}

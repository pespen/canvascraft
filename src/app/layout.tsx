import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

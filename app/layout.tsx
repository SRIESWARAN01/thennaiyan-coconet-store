import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kovai Chekku - Wood-pressed Coconut Oil",
  description:
    "Premium small-batch wood-pressed and cold-pressed coconut oil, batch-stamped and traceable from press to bottle.",
  openGraph: {
    title: "Kovai Chekku - Wood-pressed Coconut Oil",
    description:
      "Premium small-batch coconut oil with traceable batch numbers and press dates.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#336633",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

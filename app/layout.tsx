import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://onenight.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "One Night — Le réseau social de soirées",
    template: "%s · One Night",
  },
  description:
    "Rencontre les personnes croisées lors de tes soirées préférées. Découvre les soirées en direct, réserve en un clic et continue l'aventure après la night.",
  keywords: [
    "soirées",
    "clubbing",
    "rencontres",
    "nightlife",
    "match",
    "événements",
    "OneNight",
    "réseau social soirées",
  ],
  authors: [{ name: "One Night" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "One Night",
    title: "One Night — Le réseau social de soirées",
    description:
      "Rencontre les personnes croisées lors de tes soirées préférées. Match après la night.",
  },
  twitter: {
    card: "summary_large_image",
    title: "One Night — Le réseau social de soirées",
    description:
      "Rencontre les personnes croisées lors de tes soirées préférées. Match après la night.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0710",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

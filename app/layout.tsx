import type { Metadata } from "next";
import { Inter, Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const rubikDirt = Outfit({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grunge",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-alt",
});

export const metadata: Metadata = {
  title: {
    default: "XMA Car Rental | Luxury Car Rental Dubai",
    template: "%s | XMA Car Rental",
  },
  description:
    "Experience premium luxury car rental in Dubai. Rent Rolls Royce, Lamborghini, Ferrari, Bentley & more. Starting from 250 AED/day. 24/7 service.",
  keywords: [
    "luxury car rental dubai",
    "exotic car rental",
    "supercar hire dubai",
    "rolls royce rental",
    "lamborghini rental dubai",
    "ferrari rental dubai",
    "bentley rental",
    "sports car rental",
    "premium car hire",
    "dubai car rental",
  ],
  authors: [{ name: "XMA Car Rental" }],
  creator: "XMA Car Rental",
  publisher: "XMA Car Rental",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://xmacarrental.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://xmacarrental.com",
    siteName: "XMA Car Rental",
    title: "XMA Car Rental | Luxury Car Rental Dubai",
    description:
      "Experience premium luxury car rental in Dubai. Rent Rolls Royce, Lamborghini, Ferrari, Bentley & more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "XMA Car Rental - Luxury Car Rental Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XMA Car Rental | Luxury Car Rental Dubai",
    description:
      "Experience premium luxury car rental in Dubai. Rent Rolls Royce, Lamborghini, Ferrari & more.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rubikDirt.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

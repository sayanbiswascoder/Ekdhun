import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const siteName = "Ekdhun";

const description =
  "One tune, shared together. Create listening rooms, invite friends, and enjoy synchronized music playback together in real time.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Ekdhun — Listen Together, Anywhere",
    template: "%s | Ekdhun",
  },

  description,

  applicationName: siteName,

  keywords: [
  // Brand keywords
  "Ekdhun",
  "Ekdhun music",
  "Ekdhun listening rooms",
  "Ek Dhun",

  "Sync Music",
  "Beat Sync",
  "beatsync",

  // Core product keywords
  "listen to music together",
  "synchronized music listening",
  "sync music with friends",
  "real time music synchronization",
  "online music listening room",
  "shared music listening",
  "group music listening",
  "virtual listening room",
  "collaborative music listening",

  // Listening party keywords
  "online listening party",
  "virtual music party",
  "listen party with friends",
  "music party online",
  "watch and listen together",
  "listen together online",
  "private music listening room",
  "create music listening room",

  // YouTube-related keywords
  "YouTube listening party",
  "YouTube music with friends",
  "listen to YouTube together",
  "synchronized YouTube playback",
  "YouTube sync player",
  "shared YouTube music",
  "play YouTube videos together",

  // Social music keywords
  "music sharing with friends",
  "listen to songs with friends online",
  "music rooms with friends",
  "online music community",
  "social music platform",
  "virtual music hangout",
  "music sharing platform",

  // Feature-based keywords
  "synchronized music player",
  "real time listening rooms",
  "shared music queue",
  "synchronized playback player",
  "online group music player",
  "private listening rooms",
  "invite friends to listen",
  "listen together remotely",
  "cross device music synchronization",

  // Search intent keywords
  "how to listen to music together online",
  "best app to listen to music with friends",
  "listen to music together remotely",
  "listen to YouTube with friends online",
  "free online listening party",
  "music synchronization website",
],

  authors: [{ name: "Sayan Biswas" }],
  creator: "Sayan Biswas",
  publisher: "Sayan Biswas",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName,
    title: "Ekdhun — Listen Together, Anywhere",
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ekdhun — Listen to music together in perfect sync",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ekdhun — Listen Together, Anywhere",
    description,
    images: ["/og-image.png"],
    creator: "@sudo_sayan",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      { url: "/ekdhun-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.webmanifest",

  category: "music",

  verification: {
    google: "SHyjlgl1v2Bu6s2OVyZ8obCgVdN8THG3plSGeSKdpMA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080D1B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ekdhun",
    url: siteUrl,
    description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

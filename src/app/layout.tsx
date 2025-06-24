// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Omni Chat - WhatsApp Business Integration",
  description:
    "Sistema avançado de gerenciamento de chats e instâncias WhatsApp Business",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  keywords: ["WhatsApp", "Business", "Chat", "API", "Automation"],
  authors: [{ name: "Omni Chat Team" }],
  creator: "Omni Chat",
  publisher: "Omni Chat",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://omnichat.app",
    title: "Omni Chat - WhatsApp Business Integration",
    description:
      "Sistema avançado de gerenciamento de chats e instâncias WhatsApp Business",
    siteName: "Omni Chat"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00B9AE" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}

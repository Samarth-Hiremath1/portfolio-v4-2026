import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samarth Hiremath — AI/ML Engineer",
  description:
    "AI/ML engineer working at the systems layer of intelligence — training pipelines, low-latency inference, and multi-agent systems. Incoming MSCS @ USC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        {/* Archivo (variable: weight + width) for display, JetBrains Mono for metadata */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* General Sans for body copy */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-ink font-sans antialiased">{children}</body>
    </html>
  );
}

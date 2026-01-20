import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { PWAProvider } from "../contexts/PWAContext";
import { InstallPrompt } from "../components/InstallPrompt";
import { PWAStatusIndicator } from "../components/PWAStatusIndicator";

export const metadata: Metadata = {
  title: "Socio-Economic Survey System",
  description: "A comprehensive survey system for socio-economic data collection",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", sizes: "180x180", url: "/icons/icon-180x180.png" },
    { rel: "icon", sizes: "32x32", url: "/icons/icon-32x32.png" },
    { rel: "icon", sizes: "16x16", url: "/icons/icon-16x16.png" },
  ],
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SES Survey" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-[#0B1F33] text-[#E5E7EB]" suppressHydrationWarning={true}>
        <PWAProvider>
          {children}
          <InstallPrompt />
          <PWAStatusIndicator />
        </PWAProvider>
      </body>
    </html>
  );
}

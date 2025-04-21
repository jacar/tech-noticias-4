import React from "react";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {
  AnalyticsTracker,
  ErrorBoundaryClient,
  DOMInspector,
  Branding,
} from "@/utils/creatr.scripts";
import { GlobalErrorHandler } from "@/utils/global-error-handler";
import { ThemeProvider } from "@/components/theme-provider";
import { InstallPrompt } from "@/components/InstallPrompt";
import { DebugProvider } from "@/contexts/DebugContext";
import { DebugButton } from "@/components/DebugButton";

// Create a proper React component wrapper
const ErrorBoundaryWrapper: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const ErrorBoundaryComponent =
    ErrorBoundaryClient as unknown as React.ComponentType<any>;
  return <ErrorBoundaryComponent {...props} />;
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "webcincodevNew",
    template: "%s | webcincodevNew",
  },
  description: "Noticias y actualidad tecnológica en español",
  applicationName: "webcincodevNew",
  keywords: ["tecnología", "noticias", "actualidad", "tech", "español", "web", "mobile"],
  authors: [{ name: "webcincodevNew Team" }],
  creator: "webcincodevNew Team",
  publisher: "webcincodevNew Team",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "webcincodevNew",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="webcincodevNew" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="description" content="Noticias y actualidad tecnológica en español" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#FFFFFF" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3735557735218596"
          crossOrigin="anonymous"></script>
      </head>
      <body className="relative bg-gray-50 font-sans antialiased dark:bg-slate-950">
        <GlobalErrorHandler />
        <ThemeProvider>
          <DebugProvider>
            <DOMInspector>
              <ErrorBoundaryWrapper>
                {children}
                <InstallPrompt />
                <Branding />
                <DebugButton />
              </ErrorBoundaryWrapper>
              <AnalyticsTracker siteKey="${siteKey}" />
            </DOMInspector>
          </DebugProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  try {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('Service Worker registration successful with scope: ', registration.scope);
                      })
                      .catch(function(error) {
                        console.log('Service Worker registration failed with error: ', error);
                      });
                  } catch (e) {
                    console.error('Error during service worker registration:', e);
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

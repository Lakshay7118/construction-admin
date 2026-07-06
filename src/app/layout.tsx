import type { Metadata } from "next";
import "./globals.css";
import { AdminDataProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";

export const metadata: Metadata = {
  title: "Kalpataru Constructions | Admin",
  description: "Internal admin panel for managing Kalpataru Constructions' site content.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-concrete text-charcoal font-body">
        <AuthProvider>
          <AdminDataProvider>
            <ToastProvider>{children}</ToastProvider>
          </AdminDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

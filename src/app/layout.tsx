import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SUPER ADMIN PORTAL",
  description: "Super Admin Portal for Managing Application",
  manifest: "/manifest.json",
  icons: {
    icon: "/basil.png",
    apple: "/basil.png"
  },
  themeColor: "#ffffff"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
                <Toaster duration={3000} position="top-center"/>

        {children}
      </body>
    </html>
  );
}

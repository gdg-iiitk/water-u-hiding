import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/authprovider";
import { Wendy_One } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Signout from "@/components/signout";
import Favicon from "@/components/favicon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const wendyOne = Wendy_One({
  weight: "400", // Wendy One has only one weight (400)
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Water You Hiding??",
  description: "Event Website for GDG Holi Event",
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }
        ],
        apple: [
            { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
            { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
            { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
            { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
            { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
            { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
            { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
            { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
            { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }
        ],
        other: [
            { rel: "manifest", url: "/manifest.json" }
        ]
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
         <Favicon/>
      </head>
      <body
          // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          className={`${wendyOne.className} pb-4`}
      >
      <Toaster
          position="top-left"
          toastOptions={{
              style: {
                  background: "#ECDCBF",
              },
          }}
      />
      <AuthProvider>{children}
      </AuthProvider>
      </body>
      </html>
  );
}

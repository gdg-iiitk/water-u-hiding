import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/authprovider";
import { Wendy_One } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Signout from "@/components/signout";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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

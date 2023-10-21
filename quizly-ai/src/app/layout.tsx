import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Modal from "@/components/Modal/Modal";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quizly AI",
  description: "Enjoy 3 rounds of brain teasing questions on 3 random topics",
  icons: [
    {
      rel: "icon",
      url: "/images/favicon.ico",
    },
    {
      rel: "icon",
      sizes: "16x16",
      type: "image/png",
      url: "/images/favicon-16x16.png",
    },
    {
      rel: "icon",
      sizes: "32x32",
      type: "image/png",
      url: "/images/favicon-32x32.png",
    },
    { rel: "apple-touch-icon", url: "/images/apple-touch-icon.png" },
  ],
  themeColor: "#ffffff",
  openGraph: {
    title: "Quizly AI",
    images: ["/images/thumbnail.jpg"],
    description: "Enjoy 3 rounds of brain teasing questions on 3 random topics",
  },
  twitter: {
    card: "summary_large_image",
    site: "Quizly AI",
    title: "Quizly AI",
    description: "Enjoy 3 rounds of brain teasing questions on 3 random topics",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={"h-screen overflow-y-auto " + poppins.className}>
        {children}
        <Modal />
        <Toaster />
      </body>
    </html>
  );
}

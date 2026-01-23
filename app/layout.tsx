import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";

export const metadata: Metadata = {
  title: "Peculiar Pastries | Bakes Life Better",
  description: "Artisanal, small-batch cannabis-infused cookies made in Queens, NY. THC + full-spectrum CBD for a balanced experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AgeGate />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

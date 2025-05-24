import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AarogyaX",
  description: "The Integrated Hospital Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* bg-[url('/blobscene.svg')] bg-repeat bg-cover bg-center */}
      {/* bg-gradient-to-r from-zinc-300 via-zinc-900 to-blue-900 */}
      <body
        className={`${poppins.variable} antialiased bg-[url('/layered-waves.svg')] bg-repeat bg-cover bg-center`}
      >
        <DataProvider>
          <AuthProvider>{children}</AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}

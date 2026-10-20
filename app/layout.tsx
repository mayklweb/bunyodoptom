import type { Metadata } from "next";
import { Instrument_Sans, Mulish } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./Providers";
import { AppHeader } from "./widgets/AppHeader";
import { AppFooter } from "./widgets/AppFooter";
import AuthProvider from "./context/AuthContext";

// const instrumentSans = Instrument_Sans({
//   variable: "--font-Instrument-sans",
//   subsets: ["latin"],
// });

const mulish = Mulish({
  variable: "--font-mulish-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
});

export const metadata: Metadata = {
  title: "Bunyod Optom distribyutorlik firmasi",
  description:
    "Bunyod Optom - Eng yaxshi narxlar, keng assortiment, tez yetkazib berish",
  icons: { icon: "/logo1.svg" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bunyod Optom",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <div className="w-full h-full flex flex-col">
              <AppHeader />
              <main className="w-full h-full flex flex-col flex-auto">
                <div className="w-full h-full">{children}</div>
              </main>
              <AppFooter />
            </div>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { AuthProvider } from "./context/AuthContext";
import ClientLayout from "./clientLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Delta sanity report hub",
   
  description:"Delta sanity reports"
   
};

// <meta name="google-site-verification" content="tF0Tx3i4j-4v6gFmL7YT02j6dMeVkA-_XxEfHSVAS0E" />
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
          <AuthProvider>


       <ClientLayout>

       <main>
        
        {children}
        </main>
       </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

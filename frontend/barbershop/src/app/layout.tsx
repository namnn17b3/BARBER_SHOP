'use client';

import * as dotenv from 'dotenv';
dotenv.config();

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthenrProvider } from "@/authen/Provider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const urlsWithoutRootLayour = (process.env.NEXT_PUBLIC_URL_WITHOUT_ROOT_LAYOUT)?.split(',')

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <AuthenrProvider>
        {(urlsWithoutRootLayour?.includes(pathname) || pathname.includes('/admin')) ? (
          <body className={inter.className}>
            {children}
            {
              pathname.includes('/admin') &&
              <script src="/js/flowbite.min.js"></script>
            }
          </body>
        ) : (
          <body className={inter.className} style={{ width: 'auto', backgroundColor: '#f9fafb' }}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <Header />
            <div style={{ minHeight: '80vh' }}>
              {children}
            </div>
            <Footer />
            <script src="/js/flowbite.min.js"></script>
          </body>
        )}
      </AuthenrProvider>
    </html>
  );
}

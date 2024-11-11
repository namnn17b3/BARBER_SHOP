import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: 'Barber Shop | Register',
};

export default function BarberLayout({
  children, title = 'Barber Shop | Register',
}: Readonly<{
  children: React.ReactNode;
  title?: string;
}>) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        {children}
      </main>
      <script src="/js/drag-and-rop-image-upload.js" defer></script>
    </>
  );
}

import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: 'Barber Shop | Login',
};

export default function BarberLayout({
  children, title = 'Barber Shop | Login',
}: Readonly<{
  children: React.ReactNode;
  title?: string;
}>) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main style={{ marginTop: '70px' }}>
        {children}
      </main>
    </>
  );
}

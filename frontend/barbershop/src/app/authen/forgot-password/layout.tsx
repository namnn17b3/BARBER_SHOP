import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: 'Barber Shop | Forgot Password',
};

export default function BarberLayout({
  children, title = 'Barber Shop | Forgot Password',
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
    </>
  );
}
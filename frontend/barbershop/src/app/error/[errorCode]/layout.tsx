import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: 'Barber Shop | Error',
};

export default function BarberLayout({
  children, title = 'Barber Shop | Error',
}: Readonly<{
  children: React.ReactNode;
  title?: string;
}>) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main style={{ marginTop: '8rem' }}>
        {children}
      </main>
    </>
  );
}

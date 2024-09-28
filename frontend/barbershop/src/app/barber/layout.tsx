import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: 'Barber Shop | Barber',
};

export default function BarberLayout({
  children, title = 'Barber Shop | Barber',
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

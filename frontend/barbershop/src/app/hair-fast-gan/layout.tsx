import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Barber Shop | Hair Fast Gan',
};

export default function HairFastGanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main style={{ marginTop: '8rem' }}>
      {children}
    </main>
  );
}

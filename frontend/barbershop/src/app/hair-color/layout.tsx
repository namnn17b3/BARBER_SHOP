import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Barber Shop | Hair Color',
};

export default function HairColorLayout({
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

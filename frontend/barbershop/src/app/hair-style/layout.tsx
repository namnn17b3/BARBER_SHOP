import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Barber Shop | Hair Style',
};

export default function HairStyleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main style={{ marginTop: '6rem' }}>
      {children}
    </main>
  );
}

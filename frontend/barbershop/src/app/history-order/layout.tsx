import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Barber Shop | History Order',
};

export default function HistoryOrderLayout({
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

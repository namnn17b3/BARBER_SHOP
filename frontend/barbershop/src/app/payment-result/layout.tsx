import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Barber Shop | Payment Result',
};

export default function PaymentResultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
    </main>
  );
}

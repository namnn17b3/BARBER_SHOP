export default function BarberLayout({
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

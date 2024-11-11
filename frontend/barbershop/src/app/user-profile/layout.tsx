import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Barber Shop | User Profile',
};

export default function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main style={{
      marginTop: '10rem',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '8rem'
    }}>
      {children}
    <script src="/js/drag-and-rop-image-upload.js" defer></script>
    </main>
  );
}

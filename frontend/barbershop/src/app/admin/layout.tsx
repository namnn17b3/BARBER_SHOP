import HeaderAdmin from "@/components/admin/HeaderAdmin";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Barber Shop | Dashboard',
};

export default function HairColorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <HeaderAdmin />
      <SidebarAdmin />
      <main>
        {children}
      </main>
    </div>
  );
}
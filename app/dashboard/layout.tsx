
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}

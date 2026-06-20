import Sidebar from "@/components/sidebar/Sidebar";

export default function WorkflowLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar activeNav="Flow" />
      {children}
    </div>
  );
}

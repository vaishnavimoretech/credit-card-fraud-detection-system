import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="min-w-0 flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
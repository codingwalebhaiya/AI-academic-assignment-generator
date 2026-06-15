import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-muted/30 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-hidden p-4 pt-0">
          <div className="h-full bg-card rounded-2xl shadow-md border border-border overflow-y-auto p-6 sm:p-8 hover:shadow-lg transition-all duration-300 text-card-foreground">
            {children}
          </div>
        </main>

        <MobileNav />
      </div>
    </div>
  );
}
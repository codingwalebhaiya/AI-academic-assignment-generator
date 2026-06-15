"use client";

import { ModeToggle } from "../theme-toggle";
import { Bell, User, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/assignments")) return "Assignment";
    if (pathname === "/settings") return "Settings";
    return "VedaAI";
  };

  const showBackButton = pathname !== "/";

  return (
    <header className="p-4 flex-shrink-0">
      <div className="bg-card rounded-2xl shadow-md border border-border h-16 px-6 flex items-center justify-between hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
            <Bell size={20} />
          </button>

          <div className="h-8 w-px bg-border mx-1" />

          <ModeToggle />

          <button className="flex items-center gap-2 p-1.5 pl-3 border border-border rounded-xl hover:bg-muted transition-colors">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <User size={16} />
            </div>
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">John Doe</span>
          </button>
        </div>
      </div>
    </header>
  );
}
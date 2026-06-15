"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
      hidden
      md:flex
      w-72
      flex-col
      p-4
      shrink-0
    "
    >
      <div className="flex-1 relative bg-card rounded-2xl shadow-md border border-border flex flex-col hover:shadow-lg transition-all duration-300">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-xl font-bold">V</span>
            </div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              VedaAI
            </h2>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <SidebarLink
            href="/"
            icon={<Home size={20} />}
            label="Home"
            active={pathname === "/"}
          />
          <SidebarLink
            href="/assignments"
            icon={<FileText size={20} />}
            label="Assignments"
            active={pathname.startsWith("/assignments")}
          />
          <SidebarLink
            href="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            active={pathname.startsWith("/settings")}
          />
        </nav>

        <div className="p-4 border-t border-border/50">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
        ${active
          ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}
    >
      <span className={active ? "text-primary" : "text-muted-foreground/70"}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
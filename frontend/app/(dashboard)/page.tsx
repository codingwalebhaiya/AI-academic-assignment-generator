"use client";

import Link from "next/link";
import { Plus, FileText, CheckCircle, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 md:p-12 text-primary-foreground shadow-2xl shadow-primary/20 group">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
            <Zap size={14} className="fill-current" />
            <span>AI-Powered Assignment Generation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Welcome back, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-foreground/70">
              Satyam
            </span>
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-md leading-relaxed">
            Create professional, high-fidelity academic assignments in seconds with our advanced AI engine.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 h-14 font-bold shadow-xl transition-all hover:scale-105 active:scale-95 border-none">
              <Link href="/assignments/create" className="flex items-center gap-2">
                <Plus size={20} />
                Create New Assignment
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-2xl px-6 h-14 font-semibold border border-white/20">
              <Link href="/assignments">View Archive</Link>
            </Button>
          </div>
        </div>


        <div className="absolute top-0 right-0  h-full w-1/3 hidden lg:block opacity-80 group-hover:opacity-100 transition-opacity duration-700">
          <div className="relative h-full w-full ">
            <Image
              src="/dashboard-hero-removebg-preview.png"
              alt="AI Illustration"
              fill
              className="object-contain object-right transform translate-x-8 -translate-y-8 scale-110 invert dark:invert-0"
              priority
            />
          </div>
        </div>

        {/* Background Decorative Blob */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FileText size={24} />}
          label="Total Assignments"
          value="12"
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          label="Generated PDFs"
          value="08"
          color="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Active Sessions"
          value="03"
          color="bg-amber-500/10 text-amber-500"
        />
      </div>


    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300 group text-card-foreground">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-current/10`}>
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
        <p className="text-4xl font-bold text-foreground leading-none">{value}</p>
      </div>
    </div>
  );
}
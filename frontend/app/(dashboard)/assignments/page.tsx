"use client";

import AssignmentsGrid from "@/features/assignments/components/AssignmentsPage/AssignmentsGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Plus, Loader2, AlertCircle, Search, Filter, ChevronDown, RefreshCcw } from "lucide-react";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useAssignmentMutations } from "@/features/assignments/hooks/useAssignmentMutations";
import { Assignment as AssignmentItem } from "@/features/assignments/types/assignment";

export type { AssignmentItem };

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const { data: assignments = [], isLoading, error, refetch } = useAssignments();
  const { deleteAssignment, isDeleting } = useAssignmentMutations();

  const subjects = useMemo(() => {
    const subs = Array.from(new Set(assignments.map(a => a.subject)));
    return ["All", ...subs];
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch = assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "All" || assignment.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [assignments, searchQuery, selectedSubject]);

  const handleDeleteAssignment = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(id);
      } catch (err: any) {
        console.error("Delete error:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Fetching your assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-red-50 border border-red-100 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <div>
          <p className="text-red-700 font-bold text-lg">Error Loading Data</p>
          <p className="text-sm text-red-600 mt-1">{(error as any)?.message || "An unexpected error occurred"}</p>
        </div>
        <Button
          onClick={() => refetch()}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-2 mx-auto"
        >
          <RefreshCcw size={16} /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <main className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Assignments</h1>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
              LIVE
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Manage and create assignments for your classes.</p>
        </div>

        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 h-12 shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95 shrink-0">
          <Link href="/assignments/create" className="flex items-center gap-2 font-bold">
            <Plus size={18} /> Create New
          </Link>
        </Button>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-all group-hover:border-primary/20">
            <Filter size={16} className="text-muted-foreground group-hover:text-primary" />
            <span>Filter By</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>

          {/* Simple dropdown items - for demo purposes, usually would be a controlled popover/select */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          >
            {subjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search Assignment"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all outline-none shadow-sm text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-[2.5rem] shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
            {searchQuery || selectedSubject !== "All" ? <Search size={32} /> : <Plus size={32} />}
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-foreground font-bold text-lg">
              {searchQuery || selectedSubject !== "All" ? "No matches found" : "No assignments yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || selectedSubject !== "All"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start by creating your first AI-generated assignment paper."}
            </p>
          </div>
          {!(searchQuery || selectedSubject !== "All") && (
            <Button asChild variant="outline" className="mt-2 rounded-xl border-border text-foreground hover:bg-muted">
              <Link href="/assignments/create">Create Now</Link>
            </Button>
          )}
        </div>
      ) : (
        <AssignmentsGrid assignments={filteredAssignments} onDelete={handleDeleteAssignment} />
      )}
    </main>
  );
}



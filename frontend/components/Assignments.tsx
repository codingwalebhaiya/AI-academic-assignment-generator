
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Trash2, X, Calendar, Clock, GraduationCap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AssignmentItem } from '@/app/(dashboard)/assignments/page';

interface AssignmentsProps {
  assignments: AssignmentItem[];
  onDelete: (id: string) => Promise<void>;
}

export default function Assignments({ assignments, onDelete }: AssignmentsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full">
      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="group relative bg-card rounded-3xl shadow-sm border border-border p-6 flex flex-col hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header: Subject & Dropdown */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-primary/10 text-primary border border-primary/20">
                  {assignment.subject}
                </span>
                <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {assignment.status || "Ready"}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === assignment._id ? null : assignment._id)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                >
                  <MoreVertical size={20} />
                </button>

                {openDropdown === assignment._id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                  >
                    <Link
                      href={`/assignments/${assignment._id}`}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <Eye size={18} className="mr-3" />
                      View Full Paper
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        setDeleteId(assignment._id);
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={18} className="mr-3" />
                      Delete Permanently
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Title Section */}
            <div className="flex-1 space-y-2 mb-6">
              <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors capitalize">
                {assignment.subject} Assessment
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                generated comprehensive assessment for students of grade {assignment.grade}.
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/70 group-hover:text-primary transition-colors">
                  <GraduationCap size={16} />
                </div>
                <span className="text-xs font-semibold">Grade {assignment.grade}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/70 group-hover:text-primary transition-colors">
                  <Clock size={16} />
                </div>
                <span className="text-xs font-semibold">{assignment.testDuration} Mins</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground col-span-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/70 group-hover:text-primary transition-colors">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-semibold">
                  Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Footer Action */}
            <Link
              href={`/assignments/${assignment._id}`}
              className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background rounded-2xl font-bold text-sm hover:bg-primary hover:text-white shadow-lg transition-all group-hover:gap-3 group-hover:bg-primary group-hover:shadow-primary/20"
            >
              View Document <ChevronRight size={18} />
            </Link>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-background/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive">
                <Trash2 size={28} />
              </div>
              <button
                onClick={() => setDeleteId(null)}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">Delete it?</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              This will permanently delete the assignment and its associated data. This action cannot be undone.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full py-4 bg-destructive text-destructive-foreground font-bold rounded-2xl hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/10"
              >
                Yes, Delete it
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="w-full py-4 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


"use client"

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Trash2, Calendar, Clock, GraduationCap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Assignment } from "@/features/assignments/types/assignment";

interface AssignmentCardProps {
    assignment: Assignment;
    onDeleteRequest: (id: string) => void;
}

export const AssignmentCard = ({ assignment, onDeleteRequest }: AssignmentCardProps) => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="group relative bg-card rounded-3xl shadow-sm border border-border p-6 flex flex-col hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
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
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {openDropdown && (
                        <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        >
                            <Link
                                href={`/assignments/${assignment._id}`}
                                className="flex items-center px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                                onClick={() => setOpenDropdown(false)}
                            >
                                <Eye size={18} className="mr-3" />
                                View Full Paper
                            </Link>
                            <div className="h-px bg-border my-1" />
                            <button
                                onClick={() => {
                                    onDeleteRequest(assignment._id);
                                    setOpenDropdown(false);
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
    );
};


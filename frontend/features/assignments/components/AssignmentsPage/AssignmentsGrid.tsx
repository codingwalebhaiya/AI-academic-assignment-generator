
import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Assignment } from '@/features/assignments/types/assignment';
import { AssignmentCard } from './AssignmentCard';

interface AssignmentsProps {
  assignments: Assignment[];
  onDelete: (id: string) => Promise<void>;
}

export default function AssignmentsGrid({ assignments, onDelete }: AssignmentsProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
          <AssignmentCard
            key={assignment._id}
            assignment={assignment}
            onDeleteRequest={(id) => setDeleteId(id)}
          />
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


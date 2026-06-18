
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssignment, deleteAssignment } from "../api/assignment.api";

export const useAssignmentMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createAssignment,
        onSuccess: (newAssignment) => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            console.log("Assignment created successfully:", newAssignment);
        },
        onError: (error) => {
            console.error("Failed to create assignment:", error);
        },
    });

    const deleteAssignmentMutation = useMutation({
        mutationFn: deleteAssignment,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            console.log("Assignment deleted successfully:", id);
        },
        onError: (error) => {
            console.error("Failed to delete assignment:", error);
        },
    });

    return {
        createAssignment: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        deleteAssignment: deleteAssignmentMutation.mutateAsync,
        isDeleting: deleteAssignmentMutation.isPending,
    };
};

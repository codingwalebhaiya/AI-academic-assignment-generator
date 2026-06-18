import { useQuery } from "@tanstack/react-query";
import { getAssignmentById, getAssignments } from "../api/assignment.api";

export const useAssignments = () => {
    return useQuery({
        queryKey: ["assignments"],
        queryFn: getAssignments,
    });
};

export const useAssignment = (id: string) => {
    return useQuery({
        queryKey: ["assignment", id],
        queryFn: () => getAssignmentById(id),
        enabled: !!id,
    });
};

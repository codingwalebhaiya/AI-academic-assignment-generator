import { Assignment, AssignmentFormValues } from "../types/assignment";
import { API } from "@/lib/axios";


// create assignment
export const createAssignment = async (data: AssignmentFormValues): Promise<Assignment> => {
    const response = await API.post("/assignments", data);
    return response.data;
};

// get assignment by id
export const getAssignmentById = async (id: string): Promise<Assignment> => {
    const response = await API.get(`/assignments/${id}`);
    return response.data.data;
};

// get all assignments
export const getAssignments = async (): Promise<Assignment[]> => {
    const response = await API.get("/assignments");
    return response.data.data.assignments;
};

// delete assignment
export const deleteAssignment = async (id: string): Promise<void> => {
    await API.delete(`/assignments/${id}`);
};

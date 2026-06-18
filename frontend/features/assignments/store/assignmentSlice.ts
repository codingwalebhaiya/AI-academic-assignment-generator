import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssignmentState {
    isFormOpen: boolean;
    selectedAssignmentId: string | null;
    filters: {
        subject: string;
        status: string;
    };
    step: number;
    formData: {
        file: File | null;
        subject: string;
        grade: string;
        testDuration: string;
        dueDate: string;
        additionalInstructions: string;
        questionTypes: Array<{
            questionType: string;
            numberOfQuestions: number;
            marksPerQuestion: number;
        }>;
    };
}

const initialState: AssignmentState = {
    isFormOpen: false,
    selectedAssignmentId: null,
    filters: {
        subject: "all",
        status: "all",
    },
    step: 1,
    formData: {
        file: null,
        subject: "Math",
        grade: "10th",
        testDuration: "",
        dueDate: "2026-06-04",
        additionalInstructions: "",
        questionTypes: [
            {
                questionType: "Multiple Choice Questions",
                numberOfQuestions: 4,
                marksPerQuestion: 1,
            },
            {
                questionType: "Short Questions",
                numberOfQuestions: 3,
                marksPerQuestion: 2,
            },
        ],
    },
};

const assignmentSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        toggleForm: (state) => {
            state.isFormOpen = !state.isFormOpen;
        },
        selectAssignment: (state, action: PayloadAction<string | null>) => {
            state.selectedAssignmentId = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<AssignmentState["filters"]>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        updateFormData: (state, action: PayloadAction<Partial<AssignmentState["formData"]>>) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        resetForm: (state) => {
            state.formData = initialState.formData;
            state.step = 1;
        },
        addQuestionType: (state) => {
            state.formData.questionTypes.push({
                questionType: "New Question Type",
                numberOfQuestions: 1,
                marksPerQuestion: 1,
            });
        },
        removeQuestionType: (state, action: PayloadAction<number>) => {
            state.formData.questionTypes = state.formData.questionTypes.filter((_, i) => i !== action.payload);
        },
        updateQuestionType: (state, action: PayloadAction<{ index: number; field: string; value: any }>) => {
            const { index, field, value } = action.payload;
            (state.formData.questionTypes[index] as any)[field] = value;
        },
        incrementQuestionField: (state, action: PayloadAction<{ index: number; field: 'numberOfQuestions' | 'marksPerQuestion' }>) => {
            const { index, field } = action.payload;
            state.formData.questionTypes[index][field] += 1;
        },
        decrementQuestionField: (state, action: PayloadAction<{ index: number; field: 'numberOfQuestions' | 'marksPerQuestion' }>) => {
            const { index, field } = action.payload;
            if (state.formData.questionTypes[index][field] > 1) {
                state.formData.questionTypes[index][field] -= 1;
            }
        },
    },
});

export const {
    toggleForm,
    selectAssignment,
    setFilters,
    updateFormData,
    setStep,
    resetForm,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    incrementQuestionField,
    decrementQuestionField,
} = assignmentSlice.actions;
export default assignmentSlice.reducer;

// assignment state

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAssignmentFormData, IAssignmentResponse } from '../../types';
import { createAssignmentAPI } from '../../services/api';

interface AssignmentState {
  formData: IAssignmentFormData;
  currentAssignmentId: string | null;
  currentJobId: string | null;
  status: 'idle' | 'loading' | 'processing' | 'completed' | 'failed';
  progress: number;
  error: string | null;
}

const initialState: AssignmentState = {
  formData: {
    title: '',
    subject: '',
    class: '',
    dueDate: '',
    questionConfig: [],
    totalQuestions: 0,
    totalMarks: 0,
    additionalInstructions: '',
  },
  currentAssignmentId: null,
  currentJobId: null,
  status: 'idle',
  progress: 0,
  error: null,
};

// Async thunk for creating assignment
export const createAssignment = createAsyncThunk(
  'assignment/create',
  async (formData: IAssignmentFormData, { rejectWithValue }) => {
    try {
      const response = await createAssignmentAPI(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create assignment');
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<IAssignmentFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.status = 'idle';
      state.progress = 0;
      state.error = null;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setStatus: (state, action: PayloadAction<AssignmentState['status']>) => {
      state.status = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.status = 'processing';
        state.currentAssignmentId = action.payload.assignmentId;
        state.currentJobId = action.payload.jobId;
        state.progress = 0;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { updateFormData, resetForm, setProgress, setStatus, clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
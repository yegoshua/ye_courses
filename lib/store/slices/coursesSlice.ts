import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CoursesState } from '../../types';
import { MockAPI } from '../../api/mockApi';
import { logout } from './authSlice';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const courses = await MockAPI.getCourses();
      return courses;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const course = await MockAPI.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch course');
    }
  }
);

export const purchaseCourse = createAsyncThunk(
  'courses/purchaseCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const result = await MockAPI.purchaseCourse(courseId);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Purchase failed');
    }
  }
);

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
  purchaseLoading: {}
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.courses.findIndex(course => course.id === action.payload.id);
        if (existingIndex >= 0) {
          state.courses[existingIndex] = action.payload;
        } else {
          state.courses.push(action.payload);
        }
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(purchaseCourse.pending, (state, action) => {
        const courseId = action.meta.arg; // Now courseId is the direct argument
        state.purchaseLoading[courseId] = true;
      })
      .addCase(purchaseCourse.fulfilled, (state, action) => {
        const { courseId } = action.payload;
        state.purchaseLoading[courseId] = false;
        // Note: purchased courses are now managed in auth slice
      })
      .addCase(purchaseCourse.rejected, (state, action) => {
        const courseId = action.meta.arg; // Now courseId is the direct argument
        state.purchaseLoading[courseId] = false;
      })
      .addCase(logout, (state) => {
        // Clear purchase loading states on logout
        state.purchaseLoading = {};
      });
  }
});

export const { clearError } = coursesSlice.actions;
export default coursesSlice.reducer;
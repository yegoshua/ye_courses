import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../../types';
import { MockAPI } from '../../api/mockApi';
import { purchaseCourse } from './coursesSlice';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await MockAPI.login(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const user = await MockAPI.register(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUserPurchases: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.purchasedCourses = action.payload;
      }
    },
    addPurchasedCourse: (state, action: PayloadAction<string>) => {
      if (state.user && !state.user.purchasedCourses.includes(action.payload)) {
        state.user.purchasedCourses.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(purchaseCourse.fulfilled, (state, action) => {
        if (state.user && action.payload.success) {
          const courseId = action.payload.courseId;
          if (!state.user.purchasedCourses.includes(courseId)) {
            state.user.purchasedCourses.push(courseId);
          }
        }
      });
  }
});

export const { logout, clearError, setUser, updateUserPurchases, addPurchasedCourse } = authSlice.actions;
export default authSlice.reducer;
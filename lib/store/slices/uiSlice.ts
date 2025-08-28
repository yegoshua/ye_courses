import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types';

const initialState: UIState = {
  isVideoModalOpen: false,
  isAuthFormOpen: false,
  authMode: 'login',
  loading: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setVideoModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isVideoModalOpen = action.payload;
    },
    setAuthFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthFormOpen = action.payload;
    },
    setAuthMode: (state, action: PayloadAction<'login' | 'register'>) => {
      state.authMode = action.payload;
    },
    toggleAuthMode: (state) => {
      state.authMode = state.authMode === 'login' ? 'register' : 'login';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    openVideoModal: (state) => {
      state.isVideoModalOpen = true;
    },
    closeVideoModal: (state) => {
      state.isVideoModalOpen = false;
    },
    openAuthForm: (state, action: PayloadAction<'login' | 'register'>) => {
      state.isAuthFormOpen = true;
      state.authMode = action.payload;
    },
    closeAuthForm: (state) => {
      state.isAuthFormOpen = false;
    }
  }
});

export const {
  setVideoModalOpen,
  setAuthFormOpen,
  setAuthMode,
  toggleAuthMode,
  setLoading,
  openVideoModal,
  closeVideoModal,
  openAuthForm,
  closeAuthForm
} = uiSlice.actions;

export default uiSlice.reducer;
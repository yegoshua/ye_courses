import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoState } from '../../types';
import { logout } from './authSlice';

const initialState: VideoState = {
  courseId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  courseProgress: {}
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<string | null>) => {
      state.courseId = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    resetVideo: (state) => {
      state.courseId = null;
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0;
    },
    updateVideoState: (state, action: PayloadAction<Partial<VideoState>>) => {
      Object.assign(state, action.payload);
    },
    saveProgress: (state, action: PayloadAction<{ courseId: string; currentTime: number; duration: number }>) => {
      const { courseId, currentTime, duration } = action.payload;
      const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      state.courseProgress[courseId] = {
        currentTime,
        duration,
        lastWatched: new Date().toISOString(),
        completed: progressPercent >= 90 // Mark as completed if 90% watched
      };
    },
    loadProgress: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;
      const progress = state.courseProgress[courseId];
      if (progress) {
        state.currentTime = progress.currentTime;
        state.duration = progress.duration;
      }
    },
    clearAllProgress: (state) => {
      state.courseProgress = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        // Clear all video progress on logout
        state.courseProgress = {};
        state.courseId = null;
        state.isPlaying = false;
        state.currentTime = 0;
        state.duration = 0;
      });
  }
});

export const {
  setCurrentCourse,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setVolume,
  resetVideo,
  updateVideoState,
  saveProgress,
  loadProgress,
  clearAllProgress
} = videoSlice.actions;

export default videoSlice.reducer;
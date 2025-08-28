import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoState } from '../../types';

const initialState: VideoState = {
  courseId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1
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
    }
  }
});

export const {
  setCurrentCourse,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setVolume,
  resetVideo,
  updateVideoState
} = videoSlice.actions;

export default videoSlice.reducer;
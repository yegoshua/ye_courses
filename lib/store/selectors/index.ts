import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectCourses = (state: RootState) => state.courses.courses;
export const selectCoursesLoading = (state: RootState) => state.courses.loading;
export const selectCoursesError = (state: RootState) => state.courses.error;
export const selectPurchasedCourses = (state: RootState) => state.courses.purchasedCourses;
export const selectPurchaseLoading = (state: RootState) => state.courses.purchaseLoading;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export const selectVideoState = (state: RootState) => state.video;
export const selectCurrentCourse = (state: RootState) => state.video.courseId;
export const selectIsVideoPlaying = (state: RootState) => state.video.isPlaying;

export const selectUIState = (state: RootState) => state.ui;
export const selectIsVideoModalOpen = (state: RootState) => state.ui.isVideoModalOpen;
export const selectIsAuthFormOpen = (state: RootState) => state.ui.isAuthFormOpen;
export const selectAuthMode = (state: RootState) => state.ui.authMode;

export const selectCourseById = createSelector(
  [selectCourses, (_: RootState, courseId: string) => courseId],
  (courses, courseId) => courses.find(course => course.id === courseId)
);

export const selectAvailableCourses = createSelector(
  [selectCourses, selectPurchasedCourses],
  (courses, purchased) => courses.filter(course => !purchased.includes(course.id))
);

export const selectOwnedCourses = createSelector(
  [selectCourses, selectPurchasedCourses],
  (courses, purchased) => courses.filter(course => purchased.includes(course.id))
);

export const selectCoursesByCategory = createSelector(
  [selectCourses, (_: RootState, category: string) => category],
  (courses, category) => courses.filter(course => course.category === category)
);

export const selectIsCoursePurchased = createSelector(
  [selectPurchasedCourses, (_: RootState, courseId: string) => courseId],
  (purchased, courseId) => purchased.includes(courseId)
);

export const selectIsPurchaseLoading = createSelector(
  [selectPurchaseLoading, (_: RootState, courseId: string) => courseId],
  (purchaseLoading, courseId) => Boolean(purchaseLoading[courseId])
);
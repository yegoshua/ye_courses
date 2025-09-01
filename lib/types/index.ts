export interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  price: number;
  thumbnail: string;
  duration: string;
  instructor: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  studentsCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  purchasedCourses: string[];
  createdAt: string;
}

export interface CourseProgress {
  currentTime: number;
  duration: number;
  lastWatched: string;
  completed: boolean;
}

export interface VideoState {
  courseId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  courseProgress: Record<string, CourseProgress>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  purchaseLoading: Record<string, boolean>;
}

export interface UIState {
  isVideoModalOpen: boolean;
  isAuthFormOpen: boolean;
  authMode: 'login' | 'register';
  loading: boolean;
}

export interface AppState {
  courses: CoursesState;
  auth: AuthState;
  video: VideoState;
  ui: UIState;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface PurchaseResult {
  success: boolean;
  courseId: string;
  message: string;
}
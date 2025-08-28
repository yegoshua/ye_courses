import { Course, User, LoginCredentials, RegisterCredentials, PurchaseResult } from '../types';
import { mockCourses } from '../data/courses';

const MOCK_USERS = new Map<string, User>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldFail = (successRate: number = 0.9) => Math.random() > successRate;

export class MockAPI {
  static async getCourses(): Promise<Course[]> {
    await delay(Math.random() * 1000 + 500);
    
    if (shouldFail(0.95)) {
      throw new Error('Failed to fetch courses. Please try again.');
    }
    
    return mockCourses;
  }

  static async getCourseById(id: string): Promise<Course | null> {
    await delay(Math.random() * 500 + 300);
    
    if (shouldFail(0.98)) {
      throw new Error('Failed to fetch course details. Please try again.');
    }
    
    const course = mockCourses.find(c => c.id === id);
    return course || null;
  }

  static async login(credentials: LoginCredentials): Promise<User> {
    await delay(Math.random() * 1000 + 800);
    
    if (shouldFail(0.95)) {
      throw new Error('Login failed. Please check your credentials.');
    }

    const existingUser = Array.from(MOCK_USERS.values()).find(
      user => user.email === credentials.email
    );

    if (!existingUser) {
      throw new Error('Invalid email or password.');
    }

    return existingUser;
  }

  static async register(credentials: RegisterCredentials): Promise<User> {
    await delay(Math.random() * 1200 + 800);
    
    if (shouldFail(0.92)) {
      throw new Error('Registration failed. Please try again.');
    }

    const existingUser = Array.from(MOCK_USERS.values()).find(
      user => user.email === credentials.email
    );

    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      purchasedCourses: [],
      createdAt: new Date().toISOString()
    };

    MOCK_USERS.set(newUser.id, newUser);
    return newUser;
  }

  static async purchaseCourse(courseId: string, userId: string): Promise<PurchaseResult> {
    await delay(Math.random() * 1500 + 1000);
    
    if (shouldFail(0.9)) {
      return {
        success: false,
        courseId,
        message: 'Payment processing failed. Please try again or use a different payment method.'
      };
    }

    const user = MOCK_USERS.get(userId);
    const course = mockCourses.find(c => c.id === courseId);

    if (!user) {
      return {
        success: false,
        courseId,
        message: 'User not found. Please log in again.'
      };
    }

    if (!course) {
      return {
        success: false,
        courseId,
        message: 'Course not found.'
      };
    }

    if (user.purchasedCourses.includes(courseId)) {
      return {
        success: false,
        courseId,
        message: 'You already own this course.'
      };
    }

    user.purchasedCourses.push(courseId);
    MOCK_USERS.set(userId, user);

    return {
      success: true,
      courseId,
      message: `Successfully purchased "${course.title}"! You can now access all course content.`
    };
  }

  static async getUserPurchases(userId: string): Promise<string[]> {
    await delay(Math.random() * 300 + 200);
    
    const user = MOCK_USERS.get(userId);
    return user?.purchasedCourses || [];
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default MockAPI;
import { Course, User, LoginCredentials, RegisterCredentials, PurchaseResult } from '../types';
import { mockCourses } from '../data/courses';

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
      throw new Error('Login failed. Please try again.');
    }

    const user: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.email.split('@')[0], 
      purchasedCourses: [],
      createdAt: new Date().toISOString()
    };
    return user;
  }

  static async register(credentials: RegisterCredentials): Promise<User> {
    await delay(Math.random() * 1200 + 800);
    
    if (shouldFail(0.95)) {
      throw new Error('Registration failed. Please try again.');
    }

    // Simply create and return a user object - no duplicate checking needed for demo
    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      purchasedCourses: [],
      createdAt: new Date().toISOString()
    };

    return newUser;
  }

  static async purchaseCourse(courseId: string): Promise<PurchaseResult> {
    await delay(Math.random() * 1500 + 1000);
    
    if (shouldFail(0.9)) {
      return {
        success: false,
        courseId,
        message: 'Payment processing failed. Please try again or use a different payment method.'
      };
    }

    const course = mockCourses.find(c => c.id === courseId);

    if (!course) {
      return {
        success: false,
        courseId,
        message: 'Course not found.'
      };
    }
    return {
      success: true,
      courseId,
      message: `Successfully purchased "${course.title}"! You can now access all course content.`
    };
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
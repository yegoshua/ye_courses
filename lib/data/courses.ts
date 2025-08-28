import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Development Bootcamp',
    description: 'Master React from the ground up with hooks, context, Redux, and modern development practices. Build real-world applications and learn industry best practices.',
    videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    price: 89.99,
    thumbnail: '/thumbnails/react-bootcamp.jpg',
    duration: '12.5 hours',
    instructor: 'Sarah Chen',
    category: 'Web Development',
    level: 'Intermediate',
    rating: 4.8,
    studentsCount: 12547,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Next.js 15 & Server Components Deep Dive',
    description: 'Learn the latest Next.js features including App Router, Server Components, and modern deployment strategies. Build full-stack applications with confidence.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    price: 129.99,
    thumbnail: '/thumbnails/nextjs-deep-dive.jpg',
    duration: '8.5 hours',
    instructor: 'Alex Rodriguez',
    category: 'Web Development',
    level: 'Advanced',
    rating: 4.9,
    studentsCount: 8934,
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'TypeScript Fundamentals for JavaScript Developers',
    description: 'Transform your JavaScript skills with TypeScript. Learn type safety, interfaces, generics, and advanced patterns that make your code more robust.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    price: 59.99,
    thumbnail: '/thumbnails/typescript-fundamentals.jpg',
    duration: '6.5 hours',
    instructor: 'Michael Thompson',
    category: 'Programming Languages',
    level: 'Beginner',
    rating: 4.7,
    studentsCount: 15623,
    createdAt: '2024-01-10T09:15:00Z'
  },
  {
    id: '4',
    title: 'Advanced CSS Animations & Transitions',
    description: 'Create stunning animations and smooth transitions that elevate user experience. Master CSS Grid, Flexbox, and modern animation techniques.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    price: 49.99,
    thumbnail: '/thumbnails/css-animations.jpg',
    duration: '4.5 hours',
    instructor: 'Emma Wilson',
    category: 'Design',
    level: 'Intermediate',
    rating: 4.6,
    studentsCount: 9876,
    createdAt: '2024-03-05T16:20:00Z'
  },
  {
    id: '5',
    title: 'Node.js & Express API Development',
    description: 'Build scalable backend APIs with Node.js and Express. Learn authentication, database integration, testing, and deployment to production.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    price: 99.99,
    thumbnail: '/thumbnails/nodejs-api.jpg',
    duration: '10.5 hours',
    instructor: 'David Kim',
    category: 'Backend Development',
    level: 'Intermediate',
    rating: 4.8,
    studentsCount: 7432,
    createdAt: '2024-02-12T11:45:00Z'
  },
  {
    id: '6',
    title: 'UI/UX Design Principles for Developers',
    description: 'Bridge the gap between development and design. Learn color theory, typography, layout principles, and user psychology to create better interfaces.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    price: 79.99,
    thumbnail: '/thumbnails/uiux-design.jpg',
    duration: '7.5 hours',
    instructor: 'Lisa Park',
    category: 'Design',
    level: 'Beginner',
    rating: 4.7,
    studentsCount: 11234,
    createdAt: '2024-01-28T13:10:00Z'
  },
  {
    id: '7',
    title: 'Full-Stack GraphQL with Apollo & React',
    description: 'Master GraphQL from client to server. Build modern applications with Apollo Client, Apollo Server, and real-time subscriptions.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    price: 149.99,
    thumbnail: '/thumbnails/graphql-fullstack.jpg',
    duration: '14.5 hours',
    instructor: 'James Anderson',
    category: 'Full Stack',
    level: 'Advanced',
    rating: 4.9,
    studentsCount: 5678,
    createdAt: '2024-03-15T08:30:00Z'
  },
  {
    id: '8',
    title: 'React Native Mobile Development',
    description: 'Build native mobile apps for iOS and Android using React Native. Learn navigation, state management, native modules, and app store deployment.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    price: 119.99,
    thumbnail: '/thumbnails/react-native.jpg',
    duration: '11.5 hours',
    instructor: 'Maria Garcia',
    category: 'Mobile Development',
    level: 'Intermediate',
    rating: 4.6,
    studentsCount: 8765,
    createdAt: '2024-02-28T15:20:00Z'
  },
  {
    id: '9',
    title: 'JavaScript Testing with Jest & Testing Library',
    description: 'Write confident, maintainable tests for your JavaScript applications. Learn unit testing, integration testing, and test-driven development.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Subaru.mp4',
    price: 69.99,
    thumbnail: '/thumbnails/javascript-testing.jpg',
    duration: '5.5 hours',
    instructor: 'Robert Johnson',
    category: 'Testing',
    level: 'Intermediate',
    rating: 4.8,
    studentsCount: 6543,
    createdAt: '2024-03-20T12:00:00Z'
  },
  {
    id: '10',
    title: 'AWS Cloud Development for Web Applications',
    description: 'Deploy and scale web applications on AWS. Learn Lambda, S3, CloudFront, RDS, and infrastructure as code with AWS CDK.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    price: 159.99,
    thumbnail: '/thumbnails/aws-cloud.jpg',
    duration: '13.5 hours',
    instructor: 'Kevin Wong',
    category: 'Cloud Computing',
    level: 'Advanced',
    rating: 4.7,
    studentsCount: 4321,
    createdAt: '2024-03-10T10:45:00Z'
  }
];

export const getRandomCourses = (count: number = 6): Course[] => {
  const shuffled = [...mockCourses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return mockCourses.filter(course => course.category === category);
};
import { Layout } from '@/components/layout/Layout';
import { MyCourses } from '@/components/courses/MyCourses';
import { AuthForm } from '@/components/auth/AuthForm';
import { VideoModal } from '@/components/video/VideoModal';

export default function MyCoursesPage() {
  return (
    <Layout>
      <MyCourses />
      <AuthForm />
      <VideoModal />
    </Layout>
  );
}
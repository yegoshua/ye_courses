'use client';

import { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { BookOpen, Play, Clock, Users } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { openAuthForm } from '@/lib/store/slices/uiSlice';
import { openVideoModal } from '@/lib/store/slices/uiSlice';
import { setCurrentCourse } from '@/lib/store/slices/videoSlice';
import { 
  selectIsAuthenticated, 
 
  selectOwnedCourses,
  selectCoursesLoading
} from '@/lib/store/selectors';

export function MyCourses() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const ownedCourses = useAppSelector(selectOwnedCourses);
  const loading = useAppSelector(selectCoursesLoading);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(openAuthForm('login'));
    }
  }, [isAuthenticated, dispatch]);

  const handleWatchCourse = useCallback((courseId: string) => {
    dispatch(setCurrentCourse(courseId));
    dispatch(openVideoModal());
  }, [dispatch]);

  const formatPrice = useMemo(() => (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }, []);

  const formatNumber = useMemo(() => (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  }, []);

  const getLevelColor = useMemo(() => (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your purchased courses.
          </p>
          <Button onClick={() => dispatch(openAuthForm('login'))}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">
            {ownedCourses.length === 0 
              ? "You haven't purchased any courses yet." 
              : `You have ${ownedCourses.length} course${ownedCourses.length === 1 ? '' : 's'} in your library.`
            }
          </p>
        </div>

        {ownedCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your learning journey by exploring our course catalog and purchasing your first course.
            </p>
            <Link href="/">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ownedCourses.map((course) => (
              <Card key={course.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    {course.thumbnail ? (
                      // Real thumbnail image
                      <Image
                        src={course.thumbnail} 
                        alt={course.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback placeholder - shown when no thumbnail or image fails */}
                    <div 
                      className={`fallback-placeholder absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent ${
                        course.thumbnail ? 'hidden' : 'flex'
                      } items-center justify-center`}
                      style={{ display: course.thumbnail ? 'none' : 'flex' }}
                    >
                      <div className="rounded-full bg-background/80 p-4 text-4xl font-bold text-primary backdrop-blur-sm">
                        {course.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </div>
                    </div>
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={`text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {course.category}
                      </Badge>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                      <Button
                        onClick={() => handleWatchCourse(course.id)}
                        size="lg"
                        className="rounded-full w-16 h-16 p-0"
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium mt-1">
                        by {course.instructor}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{formatNumber(course.studentsCount)} students</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Purchased for {formatPrice(course.price)}
                    </div>
                    
                    <Button
                      onClick={() => handleWatchCourse(course.id)}
                      className="gap-2"
                      size="sm"
                    >
                      <Play className="h-4 w-4" />
                      Watch Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* CTA to browse more courses */}
        {ownedCourses.length > 0 && (
          <div className="text-center py-8 border-t">
            <h3 className="text-lg font-medium mb-2">Ready for more?</h3>
            <p className="text-muted-foreground mb-4">
              Explore our full catalog and continue your learning journey.
            </p>
            <Link href="/">
              <Button variant="outline">Browse All Courses</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useCallback } from 'react';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { VideoPlayer } from './VideoPlayer';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { closeVideoModal } from '@/lib/store/slices/uiSlice';
import { resetVideo } from '@/lib/store/slices/videoSlice';
import { selectIsVideoModalOpen, selectVideoState, selectCourseById } from '@/lib/store/selectors';

export function VideoModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsVideoModalOpen);
  const videoState = useAppSelector(selectVideoState);
  const course = useAppSelector((state) => 
    videoState.courseId ? selectCourseById(state, videoState.courseId) : undefined
  );

  const handleClose = useCallback(() => {
    dispatch(closeVideoModal());
    dispatch(resetVideo());
  }, [dispatch]);

  if (!videoState.courseId || !course) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[95vw] sm:max-w-6xl p-0 gap-0">
        <DialogTitle className="sr-only">
          Video Player - {course.title}
        </DialogTitle>
        <div className="relative bg-black rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            aria-label="Close video player"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="aspect-video">
            <VideoPlayer 
              courseId={videoState.courseId} 
              className="w-full h-full"
            />
          </div>
          <div className="bg-background p-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">{course.title}</h2>
                <p className="text-sm text-muted-foreground">
                  by {course.instructor} • {course.duration}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Progress: {Math.round((videoState.currentTime / videoState.duration) * 100) || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
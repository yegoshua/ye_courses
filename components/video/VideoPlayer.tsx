'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Loader2,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { 
  setIsPlaying, 
  setCurrentTime, 
  setDuration, 
  setVolume,
  updateVideoState,
  saveProgress,
  loadProgress
} from '@/lib/store/slices/videoSlice';
import { selectVideoState, selectCourseById } from '@/lib/store/selectors';

interface VideoPlayerProps {
  courseId: string;
  className?: string;
}

export function VideoPlayer({ courseId, className = '' }: VideoPlayerProps) {
  const dispatch = useAppDispatch();
  const videoState = useAppSelector(selectVideoState);
  const course = useAppSelector((state) => selectCourseById(state, courseId));
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progressSaveTimeout, setProgressSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load saved progress when course changes
  useEffect(() => {
    if (courseId) {
      dispatch(loadProgress(courseId));
    }
  }, [courseId, dispatch]);

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !course?.videoUrl) return;

    setHasError(false);
    setIsLoaded(false);
    setIsBuffering(true);
    
    // Setup video source
    video.src = course.videoUrl;
    video.volume = videoState.volume;
    
    // Auto-resume from saved progress (if >30 seconds)
    const savedProgress = videoState.courseProgress[courseId];
    if (savedProgress && savedProgress.currentTime > 30) {
      video.currentTime = savedProgress.currentTime;
      console.log(`🎬 Auto-resuming ${course.title} from ${Math.floor(savedProgress.currentTime)}s`);
    }

    return () => {
      // Save progress before cleanup
      if (video.currentTime > 0 && video.duration > 0) {
        dispatch(saveProgress({
          courseId,
          currentTime: video.currentTime,
          duration: video.duration
        }));
      }
      
      video.removeAttribute('src');
      video.load();
    };
  }, [course?.videoUrl, courseId, videoState.courseProgress, dispatch]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsBuffering(true);
      setIsLoaded(false);
    };

    const handleLoadedData = () => {
      setIsBuffering(false);
      setIsLoaded(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
      setIsLoaded(true);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    const handleLoadedMetadata = () => {
      dispatch(setDuration(video.duration || 0));
    };

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime || 0;
      dispatch(setCurrentTime(currentTime));
      
      // Throttled progress saving (every 5 seconds)
      if (progressSaveTimeout) {
        clearTimeout(progressSaveTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (video.duration > 0) {
          dispatch(saveProgress({
            courseId,
            currentTime: video.currentTime,
            duration: video.duration
          }));
        }
      }, 5000);
      
      setProgressSaveTimeout(timeout);
    };

    const handlePlay = () => {
      dispatch(setIsPlaying(true));
    };

    const handlePause = () => {
      dispatch(setIsPlaying(false));
      
      // Immediately save progress when pausing
      if (video.duration > 0) {
        dispatch(saveProgress({
          courseId,
          currentTime: video.currentTime,
          duration: video.duration
        }));
      }
    };

    const handleVolumeChange = () => {
      dispatch(setVolume(video.volume || 0));
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setHasError(true);
      setIsBuffering(false);
      setIsLoaded(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('error', handleError);

    return () => {
      // Clean up progress save timeout
      if (progressSaveTimeout) {
        clearTimeout(progressSaveTimeout);
      }
      
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('error', handleError);
    };
  }, [dispatch, courseId, progressSaveTimeout]);

  // Control visibility
  useEffect(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    if (videoState.isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    } else {
      setShowControls(true);
    }

    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [videoState.isPlaying, showControls]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (videoState.isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = value[0];
    dispatch(setCurrentTime(value[0]));
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0] / 100;
    video.volume = newVolume;
    dispatch(setVolume(newVolume));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center aspect-video bg-muted rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => videoState.isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={course.thumbnail}
        playsInline
        src={course.videoUrl}
        preload="metadata"
      />

      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <X className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-white text-lg font-medium mb-2">Unable to load video</p>
            <p className="text-white/80 text-sm">Please try refreshing or check your internet connection</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls || !videoState.isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[videoState.currentTime]}
              max={videoState.duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/80 mt-1">
              <span>{formatTime(videoState.currentTime)}</span>
              <span>{formatTime(videoState.duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="text-white hover:bg-white/20"
              >
                {videoState.isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {videoState.volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[videoState.volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Course Info Overlay */}
        <div className="absolute top-4 left-4 text-white">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <p className="text-sm text-white/80">by {course.instructor}</p>
        </div>
      </div>
    </div>
  );
}
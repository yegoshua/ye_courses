"use client";

import Image from "next/image";
import { Star, Clock, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { purchaseCourse } from "@/lib/store/slices/coursesSlice";
import { openVideoModal } from "@/lib/store/slices/uiSlice";
import { setCurrentCourse } from "@/lib/store/slices/videoSlice";
import { openAuthForm } from "@/lib/store/slices/uiSlice";
import {
  selectIsAuthenticated,
  selectUser,
  selectIsCoursePurchased,
  selectIsPurchaseLoading,
} from "@/lib/store/selectors";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isOwned = useAppSelector((state) =>
    selectIsCoursePurchased(state, course.id)
  );
  const isPurchasing = useAppSelector((state) =>
    selectIsPurchaseLoading(state, course.id)
  );

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      dispatch(openAuthForm("login"));
      return;
    }

    try {
      const result = await dispatch(
        purchaseCourse(course.id)
      ).unwrap();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("💥 Purchase error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to purchase course. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleWatchCourse = () => {
    dispatch(setCurrentCourse(course.id));
    dispatch(openVideoModal());
  };

  const handleCardClick = () => {
    handleWatchCourse();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getLevelColor = (level: Course["level"]) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const placeholder = target.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = "flex";
                }
              }}
            />
          ) : null}

          {/* Fallback placeholder - shown when no thumbnail or image fails */}
          <div
            className={`fallback-placeholder absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent ${
              course.thumbnail ? "hidden" : "flex"
            } items-center justify-center`}
            style={{ display: course.thumbnail ? "none" : "flex" }}
          >
            <div className="rounded-full bg-background/80 p-4 text-4xl font-bold text-primary backdrop-blur-sm">
              {course.title
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge
              className={`text-xs font-medium ${getLevelColor(course.level)}`}
            >
              {course.level}
            </Badge>
            <Badge variant="secondary" className="text-xs font-medium">
              {course.category}
            </Badge>
          </div>

          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              by {course.instructor}
            </p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">
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
          <div className="text-2xl font-bold text-primary">
            {formatPrice(course.price)}
          </div>

          <div className="flex gap-2">            
            {!isOwned && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase();
                }}
                disabled={isPurchasing}
                className="gap-2"
                size="sm"
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Purchasing...
                  </>
                ) : (
                  <>Buy Now</>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

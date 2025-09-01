"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";

import {
  Button,
  Alert,
  AlertDescription,
  Skeleton,
} from "@/components/ui";

import { CourseCard } from "./CourseCard";
import { CourseFilters } from "./CourseFilters";
import { useFilters } from "@/lib/hooks/useFilters";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { fetchCourses } from "@/lib/store/slices/coursesSlice";
import {
  selectCourses,
  selectCoursesLoading,
  selectCoursesError,
} from "@/lib/store/selectors";

export function CourseList() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector(selectCourses);
  const loading = useAppSelector(selectCoursesLoading);
  const error = useAppSelector(selectCoursesError);

  const {
    searchTerm,
    sortBy,
    filterLevel,
    categoryFilter,
    showFilters,
    hasActiveFilters,
    setSearchTerm,
    setSortBy,
    setFilterLevel,
    setCategoryFilter,
    setShowFilters,
    clearFilters,
  } = useFilters();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  );

  const filteredAndSortedCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel =
        filterLevel === "all" || course.level.toLowerCase() === filterLevel;

      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter;

      return matchesSearch && matchesLevel && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "students":
          return b.studentsCount - a.studentsCount;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => dispatch(fetchCourses())}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <p className="text-muted-foreground mt-1">
            {loading
              ? "Loading courses..."
              : `${filteredAndSortedCourses.length} course${
                  filteredAndSortedCourses.length === 1 ? "" : "s"
                } available`}
          </p>
        </div>

        {/* Search and Filters */}
        <CourseFilters
          searchTerm={searchTerm}
          sortBy={sortBy}
          filterLevel={filterLevel}
          categoryFilter={categoryFilter}
          categories={categories}
          showFilters={showFilters}
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
          onLevelChange={setFilterLevel}
          onCategoryChange={setCategoryFilter}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="mb-4">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

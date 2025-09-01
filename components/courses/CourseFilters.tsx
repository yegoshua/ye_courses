"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Filter, Search, X } from "lucide-react";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@/components/ui";

import { 
  SORT_OPTIONS, 
  LEVEL_FILTERS, 
  SORT_OPTIONS_ARRAY, 
  LEVEL_FILTERS_ARRAY,
  SortOption, 
  FilterOption 
} from "@/lib/constants/filters";

interface CourseFiltersProps {
  searchTerm: string;
  sortBy: SortOption;
  filterLevel: FilterOption;
  categoryFilter: string;
  categories: string[];
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onLevelChange: (value: FilterOption) => void;
  onCategoryChange: (value: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

function CourseFiltersComponent({
  searchTerm,
  sortBy,
  filterLevel,
  categoryFilter,
  categories,
  showFilters,
  onSearchChange,
  onSortChange,
  onLevelChange,
  onCategoryChange,
  onToggleFilters,
  onClearFilters,
}: CourseFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Update URL when filters change
  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "newest" && value !== "") {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });

      const newURL = `${window.location.pathname}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
      }`;

      router.replace(newURL, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL({
        search: searchTerm,
        sort: sortBy,
        level: filterLevel,
        category: categoryFilter,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy, filterLevel, categoryFilter, updateURL]);

  const hasActiveFilters =
    searchTerm ||
    sortBy !== "newest" ||
    filterLevel !== "all" ||
    categoryFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses, instructors, or topics..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="gap-2 sm:w-auto"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <div className="grid gap-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS_ARRAY.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Level</label>
              <Select value={filterLevel} onValueChange={onLevelChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_FILTERS_ARRAY.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {sortBy !== "newest" && (
                  <Badge variant="secondary" className="gap-1">
                    Sort: {SORT_OPTIONS[sortBy].label}
                    <button onClick={() => onSortChange("newest")}>
                      <X className="h-3 w-3 cursor-pointer pointer-events-auto hover:scale-110 duration-200" />
                    </button>
                  </Badge>
                )}
                {filterLevel !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 pointer-events-auto"
                  >
                    Level: {LEVEL_FILTERS[filterLevel].label}
                    <button onClick={() => onLevelChange("all")}>
                      <X className="h-3 w-3 cursor-pointer pointer-events-auto hover:scale-110 duration-200" />
                    </button>
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                    <button onClick={() => onCategoryChange("all")}>
                      <X className="h-3 w-3 cursor-pointer pointer-events-auto hover:scale-110 duration-200" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="h-auto p-1 text-xs cursor-pointer"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const CourseFilters = React.memo(CourseFiltersComponent);

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SortOption, FilterOption, DEFAULT_FILTERS } from "@/lib/constants/filters";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || DEFAULT_FILTERS.search);
  const [sortBy, setSortBy] = useState<SortOption>(() => (searchParams.get("sort") as SortOption) || DEFAULT_FILTERS.sort);
  const [filterLevel, setFilterLevel] = useState<FilterOption>(() => (searchParams.get("level") as FilterOption) || DEFAULT_FILTERS.level);
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get("category") || DEFAULT_FILTERS.category);
  const [showFilters, setShowFilters] = useState(() => {
    const hasParams = searchParams.get("sort") || searchParams.get("level") || searchParams.get("category");
    return !!hasParams;
  });

  const updateURL = useCallback(
    (params: { search?: string; sort?: string; level?: string; category?: string }) => {
      const newSearchParams = new URLSearchParams(searchParams);
      
      Object.entries(params).forEach(([key, value]) => {
        const isDefault = 
          (key === "search" && value === DEFAULT_FILTERS.search) ||
          (key === "sort" && value === DEFAULT_FILTERS.sort) ||
          (key === "level" && value === DEFAULT_FILTERS.level) ||
          (key === "category" && value === DEFAULT_FILTERS.category);
          
        if (value && !isDefault) {
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

  // Debounced search update
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

  const clearFilters = useCallback(() => {
    setSearchTerm(DEFAULT_FILTERS.search);
    setSortBy(DEFAULT_FILTERS.sort);
    setFilterLevel(DEFAULT_FILTERS.level);
    setCategoryFilter(DEFAULT_FILTERS.category);
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  const hasActiveFilters =
    searchTerm !== DEFAULT_FILTERS.search ||
    sortBy !== DEFAULT_FILTERS.sort ||
    filterLevel !== DEFAULT_FILTERS.level ||
    categoryFilter !== DEFAULT_FILTERS.category;

  return {
    searchTerm,
    sortBy,
    filterLevel,
    categoryFilter,
    showFilters,
    hasActiveFilters,
    setSearchTerm,
    setSortBy: (value: SortOption) => setSortBy(value),
    setFilterLevel: (value: FilterOption) => setFilterLevel(value),
    setCategoryFilter,
    setShowFilters,
    clearFilters,
  };
}
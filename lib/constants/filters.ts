export const SORT_OPTIONS = {
  newest: { value: "newest", label: "Newest First" },
  title: { value: "title", label: "Title A-Z" },
  "price-low": { value: "price-low", label: "Price: Low to High" },
  "price-high": { value: "price-high", label: "Price: High to Low" },
  rating: { value: "rating", label: "Highest Rated" },
  students: { value: "students", label: "Most Popular" },
} as const;

export const LEVEL_FILTERS = {
  all: { value: "all", label: "All Levels" },
  beginner: { value: "beginner", label: "Beginner" },
  intermediate: { value: "intermediate", label: "Intermediate" },
  advanced: { value: "advanced", label: "Advanced" },
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;
export type FilterOption = keyof typeof LEVEL_FILTERS;

export const SORT_OPTIONS_ARRAY = Object.values(SORT_OPTIONS);
export const LEVEL_FILTERS_ARRAY = Object.values(LEVEL_FILTERS);

export const DEFAULT_FILTERS = {
  search: "",
  sort: "newest" as SortOption,
  level: "all" as FilterOption,
  category: "all",
} as const;
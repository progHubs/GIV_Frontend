import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { useSearchPosts, usePosts } from './useContent';
import type { PostQueryParams, Post } from '../types/content';
import { PAGINATION_DEFAULTS } from '../constants/content';

// ===================================
// TYPES
// ===================================

interface UseContentSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  autoSearch?: boolean;
  defaultFilters?: PostQueryParams;
}

interface ContentSearchState {
  query: string;
  filters: PostQueryParams;
  isSearching: boolean;
  hasSearched: boolean;
  results: Post[];
  totalResults: number;
  pagination: any;
  error?: string;
}

interface ContentSearchActions {
  setQuery: (query: string) => void;
  setFilters: (filters: PostQueryParams) => void;
  updateFilter: (key: keyof PostQueryParams, value: any) => void;
  removeFilter: (key: keyof PostQueryParams) => void;
  clearFilters: () => void;
  search: () => void;
  reset: () => void;
  loadMore: () => void;
}

// ===================================
// HOOK
// ===================================

export const useContentSearch = (options: UseContentSearchOptions = {}) => {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    autoSearch = true,
    defaultFilters = {},
  } = options;

  // Local state
  const [state, setState] = useState<ContentSearchState>({
    query: '',
    filters: { ...defaultFilters, page: 1, limit: PAGINATION_DEFAULTS.LIMIT },
    isSearching: false,
    hasSearched: false,
    results: [],
    totalResults: 0,
    pagination: null,
    error: undefined,
  });

  // Debounced query for auto-search
  const debouncedQuery = useDebounce(state.query, debounceMs);

  // Determine if we should use search or regular posts query
  const shouldUseSearch = state.query.trim().length >= minQueryLength;

  // Search query
  const searchQuery = useSearchPosts(
    debouncedQuery,
    state.filters,
    shouldUseSearch && autoSearch
  );

  // Regular posts query (for when no search query)
  const postsQuery = usePosts(
    !shouldUseSearch ? state.filters : undefined
  );

  // Current active query
  const activeQuery = shouldUseSearch ? searchQuery : postsQuery;

  // Update state when query results change
  useEffect(() => {
    if (activeQuery.data) {
      setState(prev => ({
        ...prev,
        results: activeQuery.data.data || [],
        totalResults: activeQuery.data.pagination?.total || 0,
        pagination: activeQuery.data.pagination,
        isSearching: false,
        hasSearched: shouldUseSearch,
        error: undefined,
      }));
    }
  }, [activeQuery.data, shouldUseSearch]);

  // Update loading state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isSearching: activeQuery.isLoading,
    }));
  }, [activeQuery.isLoading]);

  // Update error state
  useEffect(() => {
    if (activeQuery.error) {
      setState(prev => ({
        ...prev,
        error: (activeQuery.error as any)?.message || 'Search failed',
        isSearching: false,
      }));
    }
  }, [activeQuery.error]);

  // Actions
  const setQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      query,
      hasSearched: false,
    }));
  }, []);

  const setFilters = useCallback((filters: PostQueryParams) => {
    setState(prev => ({
      ...prev,
      filters: { ...filters, page: 1 }, // Reset to first page when filters change
      hasSearched: false,
    }));
  }, []);

  const updateFilter = useCallback((key: keyof PostQueryParams, value: any) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
        page: 1, // Reset to first page when filter changes
      },
      hasSearched: false,
    }));
  }, []);

  const removeFilter = useCallback((key: keyof PostQueryParams) => {
    setState(prev => {
      const newFilters = { ...prev.filters };
      delete newFilters[key];
      return {
        ...prev,
        filters: { ...newFilters, page: 1 },
        hasSearched: false,
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: { ...defaultFilters, page: 1, limit: PAGINATION_DEFAULTS.LIMIT },
      hasSearched: false,
    }));
  }, [defaultFilters]);

  const search = useCallback(() => {
    if (shouldUseSearch) {
      searchQuery.refetch();
    } else {
      postsQuery.refetch();
    }
    setState(prev => ({
      ...prev,
      isSearching: true,
      hasSearched: true,
    }));
  }, [shouldUseSearch, searchQuery, postsQuery]);

  const reset = useCallback(() => {
    setState({
      query: '',
      filters: { ...defaultFilters, page: 1, limit: PAGINATION_DEFAULTS.LIMIT },
      isSearching: false,
      hasSearched: false,
      results: [],
      totalResults: 0,
      pagination: null,
      error: undefined,
    });
  }, [defaultFilters]);

  const loadMore = useCallback(() => {
    const currentPage = state.pagination?.page || 1;
    const totalPages = state.pagination?.totalPages || 1;
    
    if (currentPage < totalPages) {
      setState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          page: currentPage + 1,
        },
      }));
    }
  }, [state.pagination]);

  // Computed values
  const hasResults = state.results.length > 0;
  const hasMore = state.pagination ? state.pagination.page < state.pagination.totalPages : false;
  const isEmpty = state.hasSearched && !hasResults && !state.isSearching;
  const isInitialLoad = !state.hasSearched && !state.isSearching;

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    const { page, limit, ...filters } = state.filters;
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof typeof filters];
      return value !== undefined && value !== null && value !== '';
    }).length;
  }, [state.filters]);

  // Search suggestions (could be enhanced with backend support)
  const suggestions = useMemo(() => {
    if (!state.query || state.query.length < 2) return [];
    
    // Simple suggestions based on common search terms
    const commonTerms = [
      'blog', 'news', 'press release', 'announcement', 'update',
      'community', 'volunteer', 'donation', 'campaign', 'event'
    ];
    
    return commonTerms
      .filter(term => term.toLowerCase().includes(state.query.toLowerCase()))
      .slice(0, 5);
  }, [state.query]);

  const actions: ContentSearchActions = {
    setQuery,
    setFilters,
    updateFilter,
    removeFilter,
    clearFilters,
    search,
    reset,
    loadMore,
  };

  return {
    // State
    query: state.query,
    filters: state.filters,
    results: state.results,
    totalResults: state.totalResults,
    pagination: state.pagination,
    error: state.error,
    
    // Status flags
    isSearching: state.isSearching,
    hasSearched: state.hasSearched,
    hasResults,
    hasMore,
    isEmpty,
    isInitialLoad,
    
    // Computed values
    activeFiltersCount,
    suggestions,
    shouldUseSearch,
    
    // Actions
    ...actions,
  };
};

// ===================================
// DEBOUNCE HOOK
// ===================================

// Simple debounce hook if not already available
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ===================================
// SEARCH HISTORY HOOK
// ===================================

export const useSearchHistory = (maxItems = 10) => {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('content-search-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) return;
    
    setHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      const newHistory = [query, ...filtered].slice(0, maxItems);
      
      try {
        localStorage.setItem('content-search-history', JSON.stringify(newHistory));
      } catch {
        // Ignore localStorage errors
      }
      
      return newHistory;
    });
  }, [maxItems]);

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== query);
      
      try {
        localStorage.setItem('content-search-history', JSON.stringify(newHistory));
      } catch {
        // Ignore localStorage errors
      }
      
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('content-search-history');
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};

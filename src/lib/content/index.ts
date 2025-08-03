// ===================================
// CONTENT MANAGEMENT SYSTEM EXPORTS
// ===================================

// Types
export * from '../../types/content';

// API Functions
export * from '../contentApi';

// React Hooks
export * from '../../hooks/useContent';
export * from '../../hooks/useContentSearch';
export * from '../../hooks/useFileUpload';

// Context
export { ContentProvider, useContentContext } from '../../contexts/ContentContext';

// Utilities
export * from '../../utils/contentUtils';
export * from '../../utils/contentRenderer';

// Constants
export * from '../../constants/content';

// Validation Schemas
export {
  createPostSchema,
  updatePostSchema,
  commentSchema,
  updateCommentSchema,
  postQuerySchema,
  type CreatePostFormData,
  type UpdatePostFormData,
  type CommentFormData,
  type UpdateCommentFormData,
  type PostQueryFormData,
} from '../validationSchemas';

// ===================================
// CONVENIENCE EXPORTS
// ===================================

// Main content hooks for easy import
export {
  usePosts,
  usePost,
  usePostBySlug,
  useFeaturedPosts,
  usePostsByAuthor,
  usePostsByTag,
  usePostsByType,
  useRelatedPosts,
  useSearchPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useIncrementPostView,
  useTogglePostLike,
  useCommentsByPost,
  useCreateComment,
  useReplyToComment,
  useUpdateComment,
  useDeleteComment,
  useApproveComment,
  useUploadFile,
  useFetchExternalUrl,
  useUploadConfig,
  contentQueryKeys,
} from '../../hooks/useContent';

// Content search hooks
export {
  useContentSearch,
  useDebounce,
  useSearchHistory,
} from '../../hooks/useContentSearch';

// File upload hook
export {
  useFileUpload,
} from '../../hooks/useFileUpload';

// Content utilities
export {
  generateSlug,
  isValidSlug,
  generateAlternativeSlug,
  createEmptyContentBlocks,
  validateContentBlocks,
  extractTextFromContentBlocks,
  extractImagesFromContentBlocks,
  countWordsInContentBlocks,
  estimateReadingTime,
  generatePostExcerpt,
  formatPostType,
  formatLanguage,
  parseTagsString,
  formatTagsArray,
  isRecentPost,
  formatPostDate,
  formatRelativeTime,
  isValidFileType,
  formatFileSize,
  generateUniqueFilename,
  getFileExtension,
  isImageFile,
  isVideoFile,
} from '../../utils/contentUtils';

// Content rendering utilities
export {
  renderContentBlocksToHtml,
  renderContentBlocksToText,
} from '../../utils/contentRenderer';

// ===================================
// CONFIGURATION OBJECTS
// ===================================

export {
  POST_TYPES,
  POST_TYPE_OPTIONS,
  LANGUAGES,
  LANGUAGE_OPTIONS,
  CONTENT_BLOCK_TYPES,
  CONTENT_BLOCK_CONFIG,
  CONTENT_BLOCK_CATEGORIES,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_DOCUMENT_TYPES,
  FILE_SIZE_LIMITS,
  FILE_TYPE_ICONS,
  PAGINATION_DEFAULTS,
  CONTENT_LIMITS,
  SORT_OPTIONS,
  FILTER_OPTIONS,
  EDITOR_CONFIG,
  SEO_DEFAULTS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../constants/content';

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Initialize content management system
 * Call this function to set up the content management system
 */
export const initializeContentManagement = () => {
  // Any initialization logic can go here
  console.log('Content Management System initialized');
};

/**
 * Get default post creation data
 */
export const getDefaultPostData = () => ({
  title: '',
  slug: '',
  content: '',
  content_blocks: {
    version: '1.0',
    blocks: [],
  },
  post_type: 'blog' as const,
  feature_image: '',
  video_url: '',
  is_featured: false,
  tags: '',
  language: 'en' as const,
});

/**
 * Get default comment data
 */
export const getDefaultCommentData = () => ({
  content: '',
});

/**
 * Get default post query parameters
 */
export const getDefaultPostQuery = () => ({
  page: 1,
  limit: 10,
  sort_by: 'created_at' as const,
  sort_order: 'desc' as const,
});

/**
 * Check if user can edit post
 */
export const canEditPost = (post: any, currentUser: any): boolean => {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  return post.author_id === currentUser.id;
};

/**
 * Check if user can delete post
 */
export const canDeletePost = (post: any, currentUser: any): boolean => {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  return post.author_id === currentUser.id;
};

/**
 * Check if user can moderate comments
 */
export const canModerateComments = (currentUser: any): boolean => {
  if (!currentUser) return false;
  return currentUser.role === 'admin' || currentUser.role === 'moderator';
};

/**
 * Check if user can edit comment
 */
export const canEditComment = (comment: any, currentUser: any): boolean => {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  return comment.user_id === currentUser.id;
};

/**
 * Check if user can delete comment
 */
export const canDeleteComment = (comment: any, currentUser: any): boolean => {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  return comment.user_id === currentUser.id;
};

// ===================================
// TYPE GUARDS
// ===================================

/**
 * Type guard to check if content blocks are valid
 */
export const isValidContentBlocks = (data: any): data is import('../../types/content').ContentBlocks => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    Array.isArray(data.blocks) &&
    data.blocks.every((block: any) =>
      block &&
      typeof block === 'object' &&
      typeof block.id === 'string' &&
      typeof block.type === 'string' &&
      typeof block.data === 'object'
    )
  );
};

/**
 * Type guard to check if post is valid
 */
export const isValidPost = (data: any): data is import('../../types/content').Post => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.slug === 'string' &&
    typeof data.post_type === 'string' &&
    ['blog', 'news', 'press_release'].includes(data.post_type)
  );
};

/**
 * Type guard to check if comment is valid
 */
export const isValidComment = (data: any): data is import('../../types/content').Comment => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.post_id === 'string' &&
    typeof data.user_id === 'string' &&
    typeof data.content === 'string'
  );
};

// ===================================
// ERROR HANDLING UTILITIES
// ===================================

/**
 * Handle content API errors
 */
export const handleContentError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Handle upload errors
 */
export const handleUploadError = (error: any): string => {
  if (error?.response?.status === 413) {
    return 'File is too large. Please choose a smaller file.';
  }
  if (error?.response?.status === 415) {
    return 'File type is not supported.';
  }
  return handleContentError(error);
};

// ===================================
// PERFORMANCE UTILITIES
// ===================================

/**
 * Debounce function for search and other operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for scroll and resize events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

import { api } from './api';
import type {
  Post,
  PostCreateData,
  PostUpdateData,
  PostQueryParams,
  PostListApiResponse,
  PostApiResponse,
  Comment,
  CommentCreateData,
  CommentUpdateData,
  CommentQueryParams,
  CommentListApiResponse,
  CommentApiResponse,
  FileUploadResponse,
  MultiFileUploadResponse,
  UploadConfig,
  ContentSearchResult,
  PostAnalytics,
} from '../types/content';

// ===================================
// POST API FUNCTIONS
// ===================================

/**
 * Get all posts with optional filtering and pagination
 */
export const getPosts = async (params?: PostQueryParams): Promise<PostListApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const url = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<PostListApiResponse>(url);
};

/**
 * Get a single post by ID
 */
export const getPostById = async (id: string): Promise<PostApiResponse> => {
  return api.get<PostApiResponse>(`/posts/id/${id}`);
};

/**
 * Get a single post by slug
 */
export const getPostBySlug = async (slug: string): Promise<PostApiResponse> => {
  return api.get<PostApiResponse>(`/posts/slug/${slug}`);
};

/**
 * Create a new post
 */
export const createPost = async (postData: PostCreateData, files?: {
  feature_image?: File;
  content_files?: File[];
  attachments?: File[];
}): Promise<PostApiResponse> => {
  const formData = new FormData();
  
  // Add post data
  Object.entries(postData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  // Add files if provided
  if (files) {
    if (files.feature_image) {
      formData.append('feature_image', files.feature_image);
    }
    if (files.content_files) {
      files.content_files.forEach(file => {
        formData.append('content_files', file);
      });
    }
    if (files.attachments) {
      files.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
  }

  return api.upload<PostApiResponse>('/posts', formData);
};

/**
 * Update an existing post
 */
export const updatePost = async (
  id: string,
  postData: Partial<PostUpdateData>,
  files?: {
    feature_image?: File;
    content_files?: File[];
    attachments?: File[];
  }
): Promise<PostApiResponse> => {
  const formData = new FormData();
  
  // Add post data
  Object.entries(postData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  // Add files if provided
  if (files) {
    if (files.feature_image) {
      formData.append('feature_image', files.feature_image);
    }
    if (files.content_files) {
      files.content_files.forEach(file => {
        formData.append('content_files', file);
      });
    }
    if (files.attachments) {
      files.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
  }

  return api.uploadPut<PostApiResponse>(`/posts/${id}`, formData);
};

/**
 * Delete a post
 */
export const deletePost = async (id: string): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/posts/${id}`);
};

/**
 * Search posts
 */
export const searchPosts = async (
  query: string,
  params?: Omit<PostQueryParams, 'title_search' | 'content_search'>
): Promise<PostListApiResponse> => {
  const queryParams = new URLSearchParams({ q: query });
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  return api.get<PostListApiResponse>(`/posts/search?${queryParams.toString()}`);
};

/**
 * Get featured posts
 */
export const getFeaturedPosts = async (params?: Omit<PostQueryParams, 'is_featured'>): Promise<PostListApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const url = `/posts/featured${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<PostListApiResponse>(url);
};

/**
 * Get posts by author
 */
export const getPostsByAuthor = async (
  authorId: string,
  params?: Omit<PostQueryParams, 'author_id'>
): Promise<PostListApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const url = `/posts/author/${authorId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<PostListApiResponse>(url);
};

/**
 * Get posts by tag
 */
export const getPostsByTag = async (
  tag: string,
  params?: Omit<PostQueryParams, 'tags'>
): Promise<PostListApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const url = `/posts/tag/${encodeURIComponent(tag)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<PostListApiResponse>(url);
};

/**
 * Get posts by type
 */
export const getPostsByType = async (
  type: string,
  params?: Omit<PostQueryParams, 'post_type'>
): Promise<PostListApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const url = `/posts/type/${type}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<PostListApiResponse>(url);
};

/**
 * Get related posts
 */
export const getRelatedPosts = async (
  postId: string,
  params?: Omit<PostQueryParams, 'exclude_id'>
): Promise<PostListApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const url = `/posts/id/${postId}/related${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<PostListApiResponse>(url);
};

/**
 * Increment post view count
 */
export const incrementPostView = async (postId: string): Promise<PostApiResponse> => {
  return api.post<PostApiResponse>(`/posts/id/${postId}/view`);
};

/**
 * Toggle post like
 */
export const togglePostLike = async (postId: string): Promise<PostApiResponse> => {
  return api.post<PostApiResponse>(`/posts/id/${postId}/like`);
};

// ===================================
// COMMENT API FUNCTIONS
// ===================================

/**
 * Get comments for a post
 */
export const getCommentsByPost = async (
  postId: string,
  params?: CommentQueryParams
): Promise<CommentListApiResponse> => {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `/comments/${postId}/comments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<CommentListApiResponse>(url);
};

/**
 * Create a comment
 */
export const createComment = async (
  postId: string,
  commentData: Omit<CommentCreateData, 'post_id'>
): Promise<CommentApiResponse> => {
  return api.post<CommentApiResponse>(`/comments/${postId}/comments`, commentData);
};

/**
 * Reply to a comment
 */
export const replyToComment = async (
  postId: string,
  parentId: string,
  content: string
): Promise<CommentApiResponse> => {
  return api.post<CommentApiResponse>(`/comments/${postId}/comments/${parentId}/reply`, { content });
};

/**
 * Update a comment
 */
export const updateComment = async (
  commentId: string,
  commentData: CommentUpdateData
): Promise<CommentApiResponse> => {
  return api.put<CommentApiResponse>(`/comments/comments/${commentId}`, commentData);
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/comments/comments/${commentId}`);
};

/**
 * Approve a comment (admin only)
 */
export const approveComment = async (commentId: string): Promise<CommentApiResponse> => {
  return api.put<CommentApiResponse>(`/comments/comments/${commentId}/approve`);
};

// ===================================
// FILE UPLOAD API FUNCTIONS
// ===================================

/**
 * Upload a single file
 */
export const uploadFile = async (file: File, config?: {
  folder?: string;
  generateThumbnails?: boolean;
  optimizeImages?: boolean;
  preserveOriginalName?: boolean;
  allowOverwrite?: boolean;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  transformations?: Record<string, any>;
}): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // Add configuration if provided
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
  }

  return api.upload<FileUploadResponse>('/posts/upload-file', formData);
};

/**
 * Fetch content from external URL
 */
export const fetchExternalUrl = async (url: string): Promise<{
  success: boolean;
  data: {
    title?: string;
    description?: string;
    image?: string;
    url: string;
  };
}> => {
  return api.post('/posts/fetch-url', { url });
};

/**
 * Get upload configuration
 */
export const getUploadConfig = async (): Promise<{
  success: boolean;
  data: UploadConfig;
}> => {
  return api.get('/posts/upload-info');
};

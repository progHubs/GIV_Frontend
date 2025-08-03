import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type {
  Post,
  PostCreateData,
  PostUpdateData,
  PostQueryParams,
  Comment,
  CommentCreateData,
  CommentUpdateData,
  CommentQueryParams,
  UploadConfig,
} from '../types/content';
import * as contentApi from '../lib/contentApi';

// ===================================
// QUERY KEYS
// ===================================

export const contentQueryKeys = {
  all: ['content'] as const,
  posts: () => [...contentQueryKeys.all, 'posts'] as const,
  post: (id: string) => [...contentQueryKeys.posts(), id] as const,
  postBySlug: (slug: string) => [...contentQueryKeys.posts(), 'slug', slug] as const,
  postsList: (params?: PostQueryParams) => [...contentQueryKeys.posts(), 'list', params] as const,
  featuredPosts: (params?: PostQueryParams) => [...contentQueryKeys.posts(), 'featured', params] as const,
  postsByAuthor: (authorId: string, params?: PostQueryParams) => 
    [...contentQueryKeys.posts(), 'author', authorId, params] as const,
  postsByTag: (tag: string, params?: PostQueryParams) => 
    [...contentQueryKeys.posts(), 'tag', tag, params] as const,
  postsByType: (type: string, params?: PostQueryParams) => 
    [...contentQueryKeys.posts(), 'type', type, params] as const,
  relatedPosts: (postId: string, params?: PostQueryParams) => 
    [...contentQueryKeys.posts(), 'related', postId, params] as const,
  searchPosts: (query: string, params?: PostQueryParams) => 
    [...contentQueryKeys.posts(), 'search', query, params] as const,
  comments: () => [...contentQueryKeys.all, 'comments'] as const,
  commentsByPost: (postId: string, params?: CommentQueryParams) => 
    [...contentQueryKeys.comments(), 'post', postId, params] as const,
  uploadConfig: () => [...contentQueryKeys.all, 'upload-config'] as const,
};

// ===================================
// POST HOOKS
// ===================================

/**
 * Hook to get posts with optional filtering and pagination
 */
export const usePosts = (params?: PostQueryParams) => {
  return useQuery({
    queryKey: contentQueryKeys.postsList(params),
    queryFn: () => contentApi.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single post by ID
 */
export const usePost = (id: string, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.post(id),
    queryFn: () => contentApi.getPostById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get a single post by slug
 */
export const usePostBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.postBySlug(slug),
    queryFn: () => contentApi.getPostBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get featured posts
 */
export const useFeaturedPosts = (params?: PostQueryParams) => {
  return useQuery({
    queryKey: contentQueryKeys.featuredPosts(params),
    queryFn: () => contentApi.getFeaturedPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get posts by author
 */
export const usePostsByAuthor = (authorId: string, params?: PostQueryParams, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.postsByAuthor(authorId, params),
    queryFn: () => contentApi.getPostsByAuthor(authorId, params),
    enabled: enabled && !!authorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get posts by tag
 */
export const usePostsByTag = (tag: string, params?: PostQueryParams, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.postsByTag(tag, params),
    queryFn: () => contentApi.getPostsByTag(tag, params),
    enabled: enabled && !!tag,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get posts by type
 */
export const usePostsByType = (type: string, params?: PostQueryParams, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.postsByType(type, params),
    queryFn: () => contentApi.getPostsByType(type, params),
    enabled: enabled && !!type,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get related posts
 */
export const useRelatedPosts = (postId: string, params?: PostQueryParams, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.relatedPosts(postId, params),
    queryFn: () => contentApi.getRelatedPosts(postId, params),
    enabled: enabled && !!postId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to search posts
 */
export const useSearchPosts = (query: string, params?: PostQueryParams, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.searchPosts(query, params),
    queryFn: () => contentApi.searchPosts(query, params),
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ===================================
// POST MUTATION HOOKS
// ===================================

/**
 * Hook to create a new post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postData, files }: {
      postData: PostCreateData;
      files?: {
        feature_image?: File;
        content_files?: File[];
        attachments?: File[];
      };
    }) => contentApi.createPost(postData, files),
    onSuccess: (data) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.posts() });
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create post');
    },
  });
};

/**
 * Hook to update a post
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, postData, files }: {
      id: string;
      postData: Partial<PostUpdateData>;
      files?: {
        feature_image?: File;
        content_files?: File[];
        attachments?: File[];
      };
    }) => contentApi.updatePost(id, postData, files),
    onSuccess: (data, variables) => {
      // Update the specific post in cache
      queryClient.setQueryData(contentQueryKeys.post(variables.id), data);
      // Invalidate posts list to ensure consistency
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.posts() });
      toast.success('Post updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update post');
    },
  });
};

/**
 * Hook to delete a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentApi.deletePost(id),
    onSuccess: (data, id) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: contentQueryKeys.post(id) });
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.posts() });
      toast.success('Post deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });
};

/**
 * Hook to increment post view
 */
export const useIncrementPostView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => contentApi.incrementPostView(postId),
    onSuccess: (data, postId) => {
      // Update the post in cache with new view count
      queryClient.setQueryData(contentQueryKeys.post(postId), data);
    },
    // Don't show error toast for view increments as it's not critical
    onError: () => {},
  });
};

/**
 * Hook to toggle post like
 */
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => contentApi.togglePostLike(postId),
    onSuccess: (data, postId) => {
      // Update the post in cache with new like count
      queryClient.setQueryData(contentQueryKeys.post(postId), data);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update like');
    },
  });
};

// ===================================
// COMMENT HOOKS
// ===================================

/**
 * Hook to get comments for a post
 */
export const useCommentsByPost = (postId: string, params?: CommentQueryParams, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.commentsByPost(postId, params),
    queryFn: () => contentApi.getCommentsByPost(postId, params),
    enabled: enabled && !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to create a comment
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      contentApi.createComment(postId, { content }),
    onSuccess: (data, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.commentsByPost(variables.postId)
      });
      // Update post comment count if post is in cache
      const postQueryKey = contentQueryKeys.post(variables.postId);
      const existingPost = queryClient.getQueryData(postQueryKey);
      if (existingPost) {
        queryClient.setQueryData(postQueryKey, {
          ...existingPost,
          data: {
            ...existingPost.data,
            comments_count: existingPost.data.comments_count + 1
          }
        });
      }
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
};

/**
 * Hook to reply to a comment
 */
export const useReplyToComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, parentId, content }: {
      postId: string;
      parentId: string;
      content: string;
    }) => contentApi.replyToComment(postId, parentId, content),
    onSuccess: (data, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.commentsByPost(variables.postId)
      });
      toast.success('Reply added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add reply');
    },
  });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      contentApi.updateComment(commentId, { content }),
    onSuccess: (data, variables) => {
      // Invalidate all comments queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.comments() });
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update comment');
    },
  });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => contentApi.deleteComment(commentId),
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.comments() });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });
};

/**
 * Hook to approve a comment (admin only)
 */
export const useApproveComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => contentApi.approveComment(commentId),
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.comments() });
      toast.success('Comment approved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve comment');
    },
  });
};

// ===================================
// FILE UPLOAD HOOKS
// ===================================

/**
 * Hook to upload a file
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, config }: {
      file: File;
      config?: Parameters<typeof contentApi.uploadFile>[1]
    }) => contentApi.uploadFile(file, config),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload file');
    },
  });
};

/**
 * Hook to fetch external URL content
 */
export const useFetchExternalUrl = () => {
  return useMutation({
    mutationFn: (url: string) => contentApi.fetchExternalUrl(url),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch URL content');
    },
  });
};

/**
 * Hook to get upload configuration
 */
export const useUploadConfig = () => {
  return useQuery({
    queryKey: contentQueryKeys.uploadConfig(),
    queryFn: () => contentApi.getUploadConfig(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// ===================================
// COMMENT HOOKS
// ===================================

/**
 * Hook to get comments for a post
 */
export const useCommentsByPost = (postId: string, params?: CommentQueryParams, enabled = true) => {
  return useQuery({
    queryKey: contentQueryKeys.commentsByPost(postId, params),
    queryFn: () => contentApi.getCommentsByPost(postId, params),
    enabled: enabled && !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to create a comment
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      contentApi.createComment(postId, { content }),
    onSuccess: (data, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.commentsByPost(variables.postId)
      });
      // Update post comment count if post is in cache
      const postQueryKey = contentQueryKeys.post(variables.postId);
      const existingPost = queryClient.getQueryData(postQueryKey);
      if (existingPost) {
        queryClient.setQueryData(postQueryKey, {
          ...existingPost,
          data: {
            ...existingPost.data,
            comments_count: existingPost.data.comments_count + 1
          }
        });
      }
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
};

/**
 * Hook to reply to a comment
 */
export const useReplyToComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, parentId, content }: {
      postId: string;
      parentId: string;
      content: string;
    }) => contentApi.replyToComment(postId, parentId, content),
    onSuccess: (data, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.commentsByPost(variables.postId)
      });
      toast.success('Reply added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add reply');
    },
  });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      contentApi.updateComment(commentId, { content }),
    onSuccess: (data, variables) => {
      // Invalidate all comments queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.comments() });
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update comment');
    },
  });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => contentApi.deleteComment(commentId),
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.comments() });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });
};

/**
 * Hook to approve a comment (admin only)
 */
export const useApproveComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => contentApi.approveComment(commentId),
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.comments() });
      toast.success('Comment approved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve comment');
    },
  });
};

// ===================================
// FILE UPLOAD HOOKS
// ===================================

/**
 * Hook to upload a file
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, config }: {
      file: File;
      config?: Parameters<typeof contentApi.uploadFile>[1]
    }) => contentApi.uploadFile(file, config),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload file');
    },
  });
};

/**
 * Hook to fetch external URL content
 */
export const useFetchExternalUrl = () => {
  return useMutation({
    mutationFn: (url: string) => contentApi.fetchExternalUrl(url),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch URL content');
    },
  });
};

/**
 * Hook to get upload configuration
 */
export const useUploadConfig = () => {
  return useQuery({
    queryKey: contentQueryKeys.uploadConfig(),
    queryFn: () => contentApi.getUploadConfig(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

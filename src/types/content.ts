// Content Management System Types
import type { BaseEntity, PaginationInfo } from './api';

// ===================================
// ENUMS AND CONSTANTS
// ===================================

export const POST_TYPES = {
  BLOG: 'blog',
  NEWS: 'news',
  PRESS_RELEASE: 'press_release',
} as const;

export const LANGUAGES = {
  ENGLISH: 'en',
  AMHARIC: 'am',
} as const;

export const CONTENT_BLOCK_TYPES = {
  HEADER: 'header',
  PARAGRAPH: 'paragraph',
  LIST: 'list',
  IMAGE: 'image',
  QUOTE: 'quote',
  TABLE: 'table',
  DELIMITER: 'delimiter',
  EMBED: 'embed',
} as const;

export type PostType = typeof POST_TYPES[keyof typeof POST_TYPES];
export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];
export type ContentBlockType = typeof CONTENT_BLOCK_TYPES[keyof typeof CONTENT_BLOCK_TYPES];

// ===================================
// CONTENT BLOCK INTERFACES
// ===================================

export interface BaseContentBlock {
  id: string;
  type: ContentBlockType;
  data: Record<string, any>;
}

export interface HeaderBlock extends BaseContentBlock {
  type: 'header';
  data: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface ParagraphBlock extends BaseContentBlock {
  type: 'paragraph';
  data: {
    text: string;
  };
}

export interface ListBlock extends BaseContentBlock {
  type: 'list';
  data: {
    style: 'ordered' | 'unordered';
    items: string[];
  };
}

export interface ImageBlock extends BaseContentBlock {
  type: 'image';
  data: {
    file: {
      url: string;
      tempId?: string;
    };
    caption?: string;
    withBorder?: boolean;
    stretched?: boolean;
    withBackground?: boolean;
  };
}

export interface QuoteBlock extends BaseContentBlock {
  type: 'quote';
  data: {
    text: string;
    caption?: string;
    alignment?: 'left' | 'center';
  };
}

export interface TableBlock extends BaseContentBlock {
  type: 'table';
  data: {
    withHeadings?: boolean;
    content: string[][];
  };
}

export interface DelimiterBlock extends BaseContentBlock {
  type: 'delimiter';
  data: Record<string, never>;
}

export interface EmbedBlock extends BaseContentBlock {
  type: 'embed';
  data: {
    service: string;
    source: string;
    embed: string;
    width?: number;
    height?: number;
    caption?: string;
  };
}

export type ContentBlock =
  | HeaderBlock
  | ParagraphBlock
  | ListBlock
  | ImageBlock
  | QuoteBlock
  | TableBlock
  | DelimiterBlock
  | EmbedBlock;

export interface ContentBlocks {
  version: string;
  blocks: ContentBlock[];
}

// ===================================
// POST INTERFACES
// ===================================

export interface Post extends BaseEntity {
  title: string;
  slug: string;
  content?: string;
  content_blocks?: ContentBlocks;
  post_type: PostType;
  author_id?: string;
  feature_image?: string;
  video_url?: string;
  views: number;
  likes: number;
  comments_count: number;
  is_featured: boolean;
  tags?: string;
  language: Language;
  translation_group_id?: string;
  users?: {
    id: string;
    full_name: string;
    profile_image_url?: string;
    role: string;
  };
}

export interface PostCreateData {
  title: string;
  slug: string;
  content?: string;
  content_blocks?: ContentBlocks;
  post_type: PostType;
  feature_image?: string;
  video_url?: string;
  is_featured?: boolean;
  tags?: string;
  language?: Language;
}

export interface PostUpdateData extends Partial<PostCreateData> {
  id: string;
}

// ===================================
// COMMENT INTERFACES
// ===================================

export interface Comment extends BaseEntity {
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  root_comment?: string;
  is_approved: boolean;
  reply_count?: number;
  users?: {
    id: string;
    full_name: string;
    profile_image_url?: string;
    role: string;
  };
  children?: Comment[];
  parent_comment?: {
    id: string;
    users?: {
      full_name: string;
    };
  };
}

export interface CommentCreateData {
  post_id: string;
  content: string;
  parent_id?: string;
}

export interface CommentUpdateData {
  content: string;
}

// ===================================
// QUERY AND FILTER INTERFACES
// ===================================

export interface PostQueryParams {
  page?: number;
  limit?: number;
  post_type?: PostType;
  language?: Language;
  title_search?: string;
  content_search?: string;
  slug_search?: string;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
  author_id?: string;
  author_name?: string;
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'views' | 'likes';
  sort_order?: 'asc' | 'desc';
  has_image?: boolean;
  content_length_min?: number;
  content_length_max?: number;
  is_featured?: boolean;
  tags?: string;
  exclude_id?: string;
  post_types?: PostType[];
  languages?: Language[];
  author_ids?: string[];
}

export interface PostQueryResponse {
  posts: Post[];
  pagination: PaginationInfo;
  filters?: {
    applied: string[];
    total: number;
  };
}

export interface CommentQueryParams {
  page?: number;
  limit?: number;
  type?: 'main' | 'replies';
  parent_id?: string;
}

export interface CommentQueryResponse {
  comments: Comment[];
  pagination: PaginationInfo;
}

// ===================================
// FILE UPLOAD INTERFACES
// ===================================

export interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  width?: number;
  height?: number;
  duration?: number;
  tempId?: string;
}

export interface FileUploadResponse {
  file: any;
  success: boolean;
  data: UploadedFile;
  message?: string;
}

export interface MultiFileUploadResponse {
  success: boolean;
  data: {
    feature_image?: UploadedFile[];
    content_files?: UploadedFile[];
    attachments?: UploadedFile[];
  };
  message?: string;
}

export interface UploadConfig {
  supportedTypes: {
    images: string[];
    videos: string[];
    documents: string[];
    all: string[];
  };
  sizeLimits: {
    image: number;
    video: number;
    document: number;
  };
  maxFiles: {
    feature_image: number;
    content_files: number;
    attachments: number;
    total: number;
  };
}

// ===================================
// API RESPONSE INTERFACES
// ===================================

export interface PostApiResponse {
  success: boolean;
  data: Post;
  message?: string;
}

export interface PostListApiResponse {
  success: boolean;
  data: Post[];
  pagination: PaginationInfo;
  filters?: {
    applied: string[];
    total: number;
  };
}

export interface CommentApiResponse {
  success: boolean;
  data: Comment;
  message?: string;
}

export interface CommentListApiResponse {
  success: boolean;
  data: Comment[];
  pagination: PaginationInfo;
}

// ===================================
// FORM DATA INTERFACES
// ===================================

export interface PostFormData {
  title: string;
  slug: string;
  content?: string;
  content_blocks?: string; // JSON string for form submission
  post_type: PostType;
  feature_image?: File | string;
  video_url?: string;
  is_featured?: boolean;
  tags?: string;
  language?: Language;
  content_files?: File[];
  attachments?: File[];
}

export interface CommentFormData {
  content: string;
}

// ===================================
// EDITOR INTERFACES
// ===================================

export interface EditorConfig {
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  tools?: string[];
  uploadEndpoint?: string;
}

export interface EditorData {
  blocks: ContentBlock[];
  version: string;
}

// ===================================
// SEARCH AND ANALYTICS INTERFACES
// ===================================

export interface PostAnalytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
  topTags: Array<{
    tag: string;
    count: number;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
}

export interface ContentSearchResult {
  posts: Post[];
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
}

// ===================================
// CONTENT MANAGEMENT INTERFACES
// ===================================

export interface ContentManagementState {
  posts: Post[];
  currentPost?: Post;
  isLoading: boolean;
  error?: string;
  pagination?: PaginationInfo;
  filters: PostQueryParams;
}

export interface CommentManagementState {
  comments: Comment[];
  isLoading: boolean;
  error?: string;
  pagination?: PaginationInfo;
}

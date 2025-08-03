import type { 
  ContentBlocks, 
  ContentBlock, 
  Post, 
  PostType, 
  Language,
  UploadedFile 
} from '../types/content';

// ===================================
// SLUG UTILITIES
// ===================================

/**
 * Generate a URL-friendly slug from a title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validate if a slug is properly formatted
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
};

/**
 * Suggest alternative slugs if the current one is taken
 */
export const generateAlternativeSlug = (baseSlug: string, existingSlugs: string[]): string => {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }
  
  return newSlug;
};

// ===================================
// CONTENT BLOCK UTILITIES
// ===================================

/**
 * Create an empty content blocks structure
 */
export const createEmptyContentBlocks = (): ContentBlocks => ({
  version: '1.0',
  blocks: []
});

/**
 * Validate content blocks structure
 */
export const validateContentBlocks = (contentBlocks: any): contentBlocks is ContentBlocks => {
  if (!contentBlocks || typeof contentBlocks !== 'object') {
    return false;
  }

  if (!contentBlocks.version || typeof contentBlocks.version !== 'string') {
    return false;
  }

  if (!Array.isArray(contentBlocks.blocks)) {
    return false;
  }

  return contentBlocks.blocks.every((block: any) => 
    block && 
    typeof block === 'object' && 
    typeof block.id === 'string' && 
    typeof block.type === 'string' && 
    typeof block.data === 'object'
  );
};

/**
 * Extract text content from content blocks for search/preview
 */
export const extractTextFromContentBlocks = (contentBlocks: ContentBlocks): string => {
  if (!contentBlocks?.blocks) return '';

  return contentBlocks.blocks
    .map(block => {
      switch (block.type) {
        case 'header':
          return block.data.text || '';
        case 'paragraph':
          return block.data.text || '';
        case 'list':
          return Array.isArray(block.data.items) ? block.data.items.join(' ') : '';
        case 'quote':
          return `${block.data.text || ''} ${block.data.caption || ''}`;
        case 'table':
          return Array.isArray(block.data.content) 
            ? block.data.content.flat().join(' ') 
            : '';
        case 'code':
          return block.data.code || '';
        case 'warning':
          return `${block.data.title || ''} ${block.data.message || ''}`;
        case 'checklist':
          return Array.isArray(block.data.items) 
            ? block.data.items.map((item: any) => item.text || '').join(' ')
            : '';
        default:
          return '';
      }
    })
    .filter(text => text.trim().length > 0)
    .join(' ');
};

/**
 * Extract images from content blocks
 */
export const extractImagesFromContentBlocks = (contentBlocks: ContentBlocks): string[] => {
  if (!contentBlocks?.blocks) return [];

  return contentBlocks.blocks
    .filter(block => block.type === 'image')
    .map(block => block.data.file?.url)
    .filter((url): url is string => !!url);
};

/**
 * Count words in content blocks
 */
export const countWordsInContentBlocks = (contentBlocks: ContentBlocks): number => {
  const text = extractTextFromContentBlocks(contentBlocks);
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Generate reading time estimate (average 200 words per minute)
 */
export const estimateReadingTime = (contentBlocks: ContentBlocks, traditionalContent?: string): number => {
  let wordCount = 0;
  
  if (contentBlocks) {
    wordCount += countWordsInContentBlocks(contentBlocks);
  }
  
  if (traditionalContent) {
    wordCount += traditionalContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  
  return Math.max(1, Math.ceil(wordCount / 200));
};

// ===================================
// POST UTILITIES
// ===================================

/**
 * Generate post excerpt from content
 */
export const generatePostExcerpt = (
  contentBlocks?: ContentBlocks, 
  traditionalContent?: string, 
  maxLength = 160
): string => {
  let text = '';
  
  if (contentBlocks) {
    text = extractTextFromContentBlocks(contentBlocks);
  } else if (traditionalContent) {
    text = traditionalContent;
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

/**
 * Format post type for display
 */
export const formatPostType = (postType: PostType): string => {
  switch (postType) {
    case 'blog':
      return 'Blog Post';
    case 'news':
      return 'News Article';
    case 'press_release':
      return 'Press Release';
    default:
      return 'Post';
  }
};

/**
 * Format language for display
 */
export const formatLanguage = (language: Language): string => {
  switch (language) {
    case 'en':
      return 'English';
    case 'am':
      return 'Amharic';
    default:
      return 'Unknown';
  }
};

/**
 * Parse tags string into array
 */
export const parseTagsString = (tagsString?: string): string[] => {
  if (!tagsString || tagsString.trim() === '') return [];
  
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

/**
 * Format tags array into string
 */
export const formatTagsArray = (tags: string[]): string => {
  return tags.filter(tag => tag.trim().length > 0).join(', ');
};

/**
 * Check if post is recently published (within last 7 days)
 */
export const isRecentPost = (createdAt: string): boolean => {
  const postDate = new Date(createdAt);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return postDate > weekAgo;
};

/**
 * Format post date for display
 */
export const formatPostDate = (dateString: string, locale = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

// ===================================
// FILE UTILITIES
// ===================================

/**
 * Validate file type for upload
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate unique filename to prevent conflicts
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, '');
  
  return `${nameWithoutExtension}-${timestamp}-${random}.${extension}`;
};

/**
 * Extract file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file is an image
 */
export const isImageFile = (file: File | UploadedFile): boolean => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if ('type' in file) {
    return imageTypes.includes(file.type);
  } else {
    return imageTypes.includes(file.mimetype);
  }
};

/**
 * Check if file is a video
 */
export const isVideoFile = (file: File | UploadedFile): boolean => {
  const videoTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv'];
  
  if ('type' in file) {
    return videoTypes.includes(file.type);
  } else {
    return videoTypes.includes(file.mimetype);
  }
};

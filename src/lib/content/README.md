# Content Management System - Frontend Implementation

This directory contains the complete frontend implementation for the GIV Society Content Management System, providing TypeScript types, API integration, React hooks, and utilities for managing posts, comments, and file uploads.

## 📁 File Structure

```
Frontend/src/
├── types/content.ts              # TypeScript type definitions
├── lib/
│   ├── contentApi.ts            # API integration functions
│   └── content/
│       ├── index.ts             # Main exports
│       └── README.md            # This file
├── hooks/
│   ├── useContent.ts            # Content management hooks
│   ├── useContentSearch.ts      # Search and filtering hooks
│   └── useFileUpload.ts         # File upload hooks
├── contexts/
│   └── ContentContext.tsx       # Global state management
├── utils/
│   ├── contentUtils.ts          # Content utility functions
│   └── contentRenderer.ts       # Content block rendering
├── constants/
│   └── content.ts               # Constants and configuration
└── lib/validationSchemas.ts     # Zod validation schemas
```

## 🚀 Quick Start

### 1. Import the Content Management System

```typescript
import {
  // Hooks
  usePosts,
  usePost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useCommentsByPost,
  useCreateComment,
  useFileUpload,
  
  // Context
  ContentProvider,
  useContentContext,
  
  // Types
  Post,
  Comment,
  ContentBlocks,
  PostCreateData,
  
  // Utilities
  generateSlug,
  formatPostDate,
  renderContentBlocksToHtml,
  
  // Constants
  POST_TYPES,
  CONTENT_BLOCK_TYPES,
} from '@/lib/content';
```

### 2. Wrap Your App with ContentProvider

```typescript
import { ContentProvider } from '@/lib/content';

function App() {
  return (
    <ContentProvider>
      {/* Your app components */}
    </ContentProvider>
  );
}
```

### 3. Use Content Hooks in Components

```typescript
import { usePosts, useCreatePost } from '@/lib/content';

function PostsList() {
  const { data: posts, isLoading, error } = usePosts({
    page: 1,
    limit: 10,
    post_type: 'blog'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {posts?.data.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📝 Core Features

### Posts Management
- **CRUD Operations**: Create, read, update, delete posts
- **Post Types**: Blog posts, news articles, press releases
- **Content Blocks**: Rich content editing with Editor.js-compatible blocks
- **File Uploads**: Feature images, content files, attachments
- **SEO Features**: Slugs, meta data, featured posts
- **Multi-language**: English and Amharic support
- **Analytics**: Views, likes, comments tracking

### Comments System
- **Threaded Comments**: Nested comment replies
- **Moderation**: Comment approval system
- **User Management**: User-specific comment permissions
- **Real-time Updates**: Optimistic updates with React Query

### File Upload System
- **Multiple File Types**: Images, videos, documents
- **Progress Tracking**: Upload progress with cancellation
- **Validation**: File type, size, and security validation
- **Cloud Storage**: Cloudinary integration
- **Drag & Drop**: Modern file upload interface

### Search & Filtering
- **Full-text Search**: Search across post titles and content
- **Advanced Filtering**: Filter by type, author, tags, date
- **Debounced Search**: Performance-optimized search
- **Search History**: Local storage of search history
- **Pagination**: Efficient data loading

## 🔧 API Integration

### Posts API

```typescript
// Get posts with filtering
const posts = await getPosts({
  page: 1,
  limit: 10,
  post_type: 'blog',
  language: 'en',
  is_featured: true
});

// Create a new post
const newPost = await createPost({
  title: 'My Blog Post',
  slug: 'my-blog-post',
  content_blocks: {
    version: '1.0',
    blocks: [...]
  },
  post_type: 'blog'
}, {
  feature_image: imageFile,
  content_files: [file1, file2]
});

// Update existing post
const updatedPost = await updatePost('post-id', {
  title: 'Updated Title'
});
```

### Comments API

```typescript
// Get comments for a post
const comments = await getCommentsByPost('post-id');

// Create a comment
const comment = await createComment('post-id', {
  content: 'Great post!'
});

// Reply to a comment
const reply = await replyToComment('post-id', 'parent-comment-id', 'Thanks!');
```

### File Upload API

```typescript
// Upload a single file
const uploadedFile = await uploadFile(file, {
  folder: 'posts',
  generateThumbnails: true,
  optimizeImages: true
});

// Get upload configuration
const config = await getUploadConfig();
```

## 🎣 React Hooks

### Content Hooks

```typescript
// Posts
const { data: posts, isLoading } = usePosts(queryParams);
const { data: post } = usePost(postId);
const { data: post } = usePostBySlug(slug);
const createPostMutation = useCreatePost();
const updatePostMutation = useUpdatePost();
const deletePostMutation = useDeletePost();

// Comments
const { data: comments } = useCommentsByPost(postId);
const createCommentMutation = useCreateComment();
const updateCommentMutation = useUpdateComment();

// File uploads
const uploadMutation = useUploadFile();
const { data: config } = useUploadConfig();
```

### Search Hooks

```typescript
const {
  query,
  results,
  isSearching,
  setQuery,
  setFilters,
  search,
  reset
} = useContentSearch({
  debounceMs: 300,
  autoSearch: true
});

const {
  history,
  addToHistory,
  clearHistory
} = useSearchHistory();
```

### File Upload Hooks

```typescript
const {
  isUploading,
  progress,
  uploadedFiles,
  addFiles,
  removeFile,
  clearFiles,
  getDragProps,
  getInputProps
} = useFileUpload({
  maxFiles: 5,
  autoUpload: true,
  allowedTypes: ['image/*', 'video/*']
});
```

## 🛠 Utilities

### Content Utilities

```typescript
// Slug generation
const slug = generateSlug('My Blog Post Title'); // 'my-blog-post-title'

// Content blocks validation
const isValid = validateContentBlocks(contentBlocks);

// Text extraction
const text = extractTextFromContentBlocks(contentBlocks);

// Reading time estimation
const readingTime = estimateReadingTime(contentBlocks); // minutes

// Date formatting
const formattedDate = formatPostDate('2023-12-01'); // 'December 1, 2023'
const relativeTime = formatRelativeTime('2023-12-01'); // '2 hours ago'
```

### Content Rendering

```typescript
// Render content blocks to HTML
const html = renderContentBlocksToHtml(contentBlocks);

// Render content blocks to plain text
const text = renderContentBlocksToText(contentBlocks);
```

### File Utilities

```typescript
// File validation
const isValid = isValidFileType(file, allowedTypes);

// File size formatting
const size = formatFileSize(1024000); // '1 MB'

// File type checking
const isImage = isImageFile(file);
const isVideo = isVideoFile(file);
```

## 🔒 Validation

### Zod Schemas

```typescript
import { createPostSchema, commentSchema } from '@/lib/content';

// Validate post data
const result = createPostSchema.safeParse(postData);
if (result.success) {
  // Data is valid
  const validData = result.data;
}

// Validate comment data
const commentResult = commentSchema.safeParse(commentData);
```

## 🎨 TypeScript Types

### Core Types

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  content_blocks?: ContentBlocks;
  post_type: 'blog' | 'news' | 'press_release';
  author_id?: string;
  feature_image?: string;
  views: number;
  likes: number;
  comments_count: number;
  is_featured: boolean;
  tags?: string;
  language: 'en' | 'am';
  created_at: string;
  updated_at: string;
}

interface ContentBlocks {
  version: string;
  blocks: ContentBlock[];
}

interface ContentBlock {
  id: string;
  type: string;
  data: Record<string, any>;
}
```

## 🔧 Configuration

### Constants

```typescript
// Post types
export const POST_TYPES = {
  BLOG: 'blog',
  NEWS: 'news',
  PRESS_RELEASE: 'press_release',
} as const;

// Content block types
export const CONTENT_BLOCK_TYPES = {
  HEADER: 'header',
  PARAGRAPH: 'paragraph',
  IMAGE: 'image',
  // ... more types
} as const;

// File size limits
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};
```

## 🚨 Error Handling

```typescript
// Handle API errors
const errorMessage = handleContentError(error);

// Handle upload errors
const uploadErrorMessage = handleUploadError(uploadError);

// Custom error handling in hooks
const createPostMutation = useCreatePost({
  onError: (error) => {
    toast.error(handleContentError(error));
  }
});
```

## 🔄 State Management

### Global Context

```typescript
const {
  state: {
    posts,
    comments,
    selectedPost,
    searchQuery,
    activeFilters
  },
  actions: {
    setPosts,
    addPost,
    updatePost,
    removePost,
    setSelectedPost,
    setSearchQuery,
    setActiveFilters
  }
} = useContentContext();
```

## 📊 Performance

- **React Query**: Intelligent caching and background updates
- **Debounced Search**: Prevents excessive API calls
- **Optimistic Updates**: Immediate UI feedback
- **Pagination**: Efficient data loading
- **File Upload Progress**: Real-time upload tracking
- **Lazy Loading**: Images and content loaded on demand

## 🧪 Testing

The implementation is designed to be testable with:
- **Mock API responses** for unit tests
- **React Testing Library** compatible hooks
- **Type-safe mocks** with TypeScript
- **Isolated components** for integration tests

## 📚 Best Practices

1. **Always use TypeScript types** for type safety
2. **Handle loading and error states** in components
3. **Use React Query for caching** and background updates
4. **Validate data with Zod schemas** before API calls
5. **Implement optimistic updates** for better UX
6. **Use debounced search** for performance
7. **Handle file upload errors** gracefully
8. **Sanitize content** before rendering

## 🔗 Related Documentation

- [Backend API Documentation](../../../Backend/README.md)
- [Database Schema](../../../Backend/prisma/schema.sql)
- [Editor.js Documentation](https://editorjs.io/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Validation](https://zod.dev/)

---

This implementation provides a complete, production-ready content management system that integrates seamlessly with the GIV Society backend while maintaining type safety, performance, and excellent developer experience.

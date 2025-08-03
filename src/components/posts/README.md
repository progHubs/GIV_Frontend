# Posts Feature Documentation

## Overview

The Posts feature provides a comprehensive news and blog system for the GIV Society website. It includes a main posts listing page, individual post detail pages, and various components for displaying and interacting with content.

## Components

### Pages

#### PostsPage (`/posts`)
- Main posts listing page with hero section, search, filtering, and sidebar
- Displays featured posts prominently and regular posts in a grid layout
- Includes search functionality and category filtering
- Responsive design with sidebar for categories and trending content

#### PostDetailPage (`/posts/:slug`)
- Individual post detail page with full content display
- Includes breadcrumb navigation, post metadata, and social sharing
- Features a comments section with nested replies
- Shows related posts at the bottom
- Responsive layout optimized for reading

### Components

#### PostsHero
- Hero section for the posts page with search functionality
- Displays statistics and engaging call-to-action
- Real-time search with debounced input
- Gradient background with animated elements

#### PostsList
- Main content area displaying posts in a grid layout
- Separates featured posts from regular posts
- Handles loading states and empty states
- Supports pagination (ready for future implementation)

#### PostCard
- Individual post card component for regular posts
- Displays post image, title, excerpt, author, and metadata
- Hover animations and interactive elements
- Responsive design with proper image handling

#### FeaturedPostCard
- Enhanced post card for featured content
- Larger layout with overlay text and special badges
- More prominent display with enhanced styling
- Optimized for high-impact content presentation

#### PostsSidebar
- Sidebar component with categories, tags, and trending posts
- Interactive category filtering
- Popular tags display with post counts
- Newsletter signup form
- Trending stories with engagement metrics

#### PostContent
- Full post content display with rich formatting
- Author information and publication metadata
- Social sharing and like functionality
- Tag display and reading time estimation
- Responsive typography and layout

#### PostComments
- Comments section with nested reply support
- Real-time comment submission (simulated)
- User authentication integration ready
- Responsive design with proper threading

#### RelatedPosts
- Related content recommendations
- Displays posts from the same category
- Grid layout with hover effects
- Links back to main posts page

## Features

### Search and Filtering
- Real-time search across post titles, content, and tags
- Category-based filtering (All, News, Blog, Press Releases)
- Responsive search interface with autocomplete ready

### Content Management
- Support for featured posts with special styling
- Rich content display with proper typography
- Image optimization and lazy loading
- Tag-based organization and discovery

### User Interaction
- Like/unlike functionality for posts
- Comment system with nested replies
- Social sharing capabilities
- Reading time estimation

### Responsive Design
- Mobile-first approach with breakpoint optimization
- Touch-friendly interfaces for mobile devices
- Proper image scaling and layout adaptation
- Accessible navigation and interaction patterns

## Data Structure

### Mock Data
The feature uses comprehensive mock data located in `Frontend/src/constants/content.ts`:

- **MOCK_POSTS**: Array of post objects with full metadata
- **MOCK_COMMENTS**: Array of comment objects with nested reply support

### Post Schema
```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  content_blocks?: ContentBlocks;
  post_type: 'news' | 'blog' | 'press_release';
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
  users?: {
    id: string;
    full_name: string;
    profile_image_url?: string;
    role: string;
  };
}
```

### Comment Schema
```typescript
interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    full_name: string;
    profile_image_url?: string;
    role: string;
  };
  children?: Comment[];
}
```

## Navigation Integration

The Posts feature is integrated into the main navigation:
- Added "Posts" link to `ModernNavigation` component
- Positioned between "Campaigns" and "Events" for logical flow
- Responsive navigation with mobile menu support

## Styling and Theming

### CSS Classes
- Uses Tailwind CSS for consistent styling
- Custom CSS utilities for text clamping and prose styling
- Responsive breakpoints and hover effects
- Dark mode ready (theme variables in place)

### Animations
- Framer Motion for smooth page transitions
- Hover animations on interactive elements
- Loading state animations and skeletons
- Scroll-triggered animations for content reveal

## Future Enhancements

### Ready for Implementation
1. **API Integration**: Replace mock data with real API calls
2. **Pagination**: Backend pagination support with infinite scroll
3. **User Authentication**: Full comment system with user accounts
4. **Content Management**: Admin interface for post creation/editing
5. **SEO Optimization**: Meta tags and structured data
6. **Social Sharing**: Enhanced sharing with platform-specific formatting
7. **Email Subscriptions**: Newsletter integration with backend
8. **Search Enhancement**: Full-text search with backend support

### Performance Optimizations
- Image lazy loading and optimization
- Content caching strategies
- Bundle splitting for posts feature
- Progressive loading for large content

## Usage

### Basic Implementation
```tsx
import { PostsPage, PostDetailPage } from '../pages';

// In your router
<Route path="/posts" element={<PostsPage />} />
<Route path="/posts/:slug" element={<PostDetailPage />} />
```

### Component Usage
```tsx
import { PostCard, FeaturedPostCard } from '../components/posts';

// Display a regular post
<PostCard post={postData} />

// Display a featured post
<FeaturedPostCard post={featuredPostData} />
```

## Dependencies

- React 18+
- React Router DOM
- Framer Motion
- date-fns
- Tailwind CSS
- TypeScript

All dependencies are already included in the project's package.json.

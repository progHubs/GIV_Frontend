import type { PostType, Language, ContentBlockType } from '../types/content';

// ===================================
// POST CONFIGURATION
// ===================================

export const POST_TYPES: Record<string, PostType> = {
  BLOG: 'blog',
  NEWS: 'news',
  PRESS_RELEASE: 'press_release',
} as const;

export const POST_TYPE_OPTIONS = [
  { value: POST_TYPES.BLOG, label: 'Blog Post', description: 'Personal insights, tutorials, and thought leadership' },
  { value: POST_TYPES.NEWS, label: 'News Article', description: 'Current events and organizational updates' },
  { value: POST_TYPES.PRESS_RELEASE, label: 'Press Release', description: 'Official announcements and media statements' },
];

export const LANGUAGES: Record<string, Language> = {
  ENGLISH: 'en',
  AMHARIC: 'am',
} as const;

export const LANGUAGE_OPTIONS = [
  { value: LANGUAGES.ENGLISH, label: 'English', flag: '🇺🇸' },
  { value: LANGUAGES.AMHARIC, label: 'አማርኛ (Amharic)', flag: '🇪🇹' },
];

// ===================================
// CONTENT BLOCK CONFIGURATION
// ===================================

export const CONTENT_BLOCK_TYPES: Record<string, ContentBlockType> = {
  HEADER: 'header',
  PARAGRAPH: 'paragraph',
  LIST: 'list',
  IMAGE: 'image',
  QUOTE: 'quote',
  TABLE: 'table',
  DELIMITER: 'delimiter',
  EMBED: 'embed',
} as const;

export const CONTENT_BLOCK_CONFIG = {
  [CONTENT_BLOCK_TYPES.HEADER]: {
    name: 'Header',
    description: 'Add headings (H1-H6)',
    icon: '📝',
    category: 'text',
  },
  [CONTENT_BLOCK_TYPES.PARAGRAPH]: {
    name: 'Paragraph',
    description: 'Add text paragraphs',
    icon: '📄',
    category: 'text',
  },
  [CONTENT_BLOCK_TYPES.LIST]: {
    name: 'List',
    description: 'Add ordered or unordered lists',
    icon: '📋',
    category: 'text',
  },
  [CONTENT_BLOCK_TYPES.IMAGE]: {
    name: 'Image',
    description: 'Add images with captions',
    icon: '🖼️',
    category: 'media',
  },
  [CONTENT_BLOCK_TYPES.QUOTE]: {
    name: 'Quote',
    description: 'Add blockquotes',
    icon: '💬',
    category: 'text',
  },
  [CONTENT_BLOCK_TYPES.TABLE]: {
    name: 'Table',
    description: 'Add data tables',
    icon: '📊',
    category: 'data',
  },
  [CONTENT_BLOCK_TYPES.DELIMITER]: {
    name: 'Delimiter',
    description: 'Add visual separators',
    icon: '➖',
    category: 'layout',
  },
  [CONTENT_BLOCK_TYPES.EMBED]: {
    name: 'Embed',
    description: 'Embed external content',
    icon: '🔗',
    category: 'media',
  },
};

export const CONTENT_BLOCK_CATEGORIES = {
  text: { name: 'Text', icon: '📝', color: '#3B82F6' },
  media: { name: 'Media', icon: '🎨', color: '#10B981' },
  data: { name: 'Data', icon: '📊', color: '#F59E0B' },
  code: { name: 'Code', icon: '💻', color: '#8B5CF6' },
  layout: { name: 'Layout', icon: '📐', color: '#6B7280' },
  special: { name: 'Special', icon: '⭐', color: '#EF4444' },
  interactive: { name: 'Interactive', icon: '🎯', color: '#EC4899' },
};

// ===================================
// FILE UPLOAD CONFIGURATION
// ===================================

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/avi',
  'video/mov',
  'video/wmv',
];

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
];

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};

export const FILE_TYPE_ICONS = {
  // Images
  'image/jpeg': '🖼️',
  'image/jpg': '🖼️',
  'image/png': '🖼️',
  'image/gif': '🎞️',
  'image/webp': '🖼️',
  
  // Videos
  'video/mp4': '🎥',
  'video/webm': '🎥',
  'video/avi': '🎥',
  'video/mov': '🎥',
  'video/wmv': '🎥',
  
  // Documents
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'application/vnd.ms-powerpoint': '📽️',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📽️',
  'text/plain': '📄',
  'text/csv': '📊',
  
  // Default
  default: '📎',
};

// ===================================
// PAGINATION AND LIMITS
// ===================================

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

export const CONTENT_LIMITS = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 255,
  SLUG_MAX_LENGTH: 255,
  EXCERPT_MAX_LENGTH: 160,
  COMMENT_MIN_LENGTH: 3,
  COMMENT_MAX_LENGTH: 1000,
  TAG_MIN_LENGTH: 2,
  TAG_MAX_LENGTH: 50,
  MAX_TAGS: 10,
};

// ===================================
// SORTING AND FILTERING
// ===================================

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created', direction: 'desc' },
  { value: 'updated_at', label: 'Date Updated', direction: 'desc' },
  { value: 'title', label: 'Title', direction: 'asc' },
  { value: 'views', label: 'Views', direction: 'desc' },
  { value: 'likes', label: 'Likes', direction: 'desc' },
];

export const FILTER_OPTIONS = {
  POST_TYPE: POST_TYPE_OPTIONS,
  LANGUAGE: LANGUAGE_OPTIONS,
  FEATURED: [
    { value: 'true', label: 'Featured Only' },
    { value: 'false', label: 'Non-Featured Only' },
  ],
  HAS_IMAGE: [
    { value: 'true', label: 'With Images' },
    { value: 'false', label: 'Without Images' },
  ],
};

// ===================================
// EDITOR CONFIGURATION
// ===================================

export const EDITOR_CONFIG = {
  placeholder: 'Start writing your content...',
  minHeight: 300,
  autofocus: true,
  tools: [
    CONTENT_BLOCK_TYPES.HEADER,
    CONTENT_BLOCK_TYPES.PARAGRAPH,
    CONTENT_BLOCK_TYPES.LIST,
    CONTENT_BLOCK_TYPES.IMAGE,
    CONTENT_BLOCK_TYPES.QUOTE,
    CONTENT_BLOCK_TYPES.TABLE,
    CONTENT_BLOCK_TYPES.DELIMITER,
    CONTENT_BLOCK_TYPES.EMBED,
  ],
};

// ===================================
// SEO AND META CONFIGURATION
// ===================================

export const SEO_DEFAULTS = {
  TITLE_SUFFIX: ' | GIV Society',
  DESCRIPTION_LENGTH: 160,
  KEYWORDS_MAX: 10,
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
};

// ===================================
// VALIDATION PATTERNS
// ===================================

export const VALIDATION_PATTERNS = {
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/.+/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TAG: /^[a-zA-Z0-9\s-_]+$/,
};

// ===================================
// ERROR MESSAGES
// ===================================

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_SLUG: 'Slug must contain only lowercase letters, numbers, and hyphens',
  INVALID_URL: 'Please enter a valid URL',
  TITLE_TOO_SHORT: `Title must be at least ${CONTENT_LIMITS.TITLE_MIN_LENGTH} characters`,
  TITLE_TOO_LONG: `Title must not exceed ${CONTENT_LIMITS.TITLE_MAX_LENGTH} characters`,
  COMMENT_TOO_SHORT: `Comment must be at least ${CONTENT_LIMITS.COMMENT_MIN_LENGTH} characters`,
  COMMENT_TOO_LONG: `Comment must not exceed ${CONTENT_LIMITS.COMMENT_MAX_LENGTH} characters`,
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',
  INVALID_FILE_TYPE: 'File type is not supported',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested content was not found',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// ===================================
// SUCCESS MESSAGES
// ===================================

export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  COMMENT_UPDATED: 'Comment updated successfully!',
  COMMENT_DELETED: 'Comment deleted successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  LIKE_ADDED: 'Post liked!',
  LIKE_REMOVED: 'Like removed!',
};

// ===================================
// MOCK DATA FOR UI DESIGN
// ===================================

import type { Post, Comment } from '../types/content';

// Mock Posts Data for UI Design
export const MOCK_POSTS: Post[] = [
  {
    id: 'preventive-care-campaigns',
    title: 'Preventive Care Campaigns: Tackling Non-Communicable Diseases',
    slug: 'preventive-care-campaigns-tackling-non-communicable-diseases',
    content: `While acute care is vital, GIV Society Ethiopia is increasingly emphasizing preventive care campaigns to combat the rising burden of non-communicable diseases (NCDs) across Ethiopia.

The Silent Epidemic
Non-communicable diseases, hypertension, and cardiovascular diseases are becoming major health concerns. Early detection and lifestyle modifications are critical for effective management of cardiovascular diseases.

Our Campaigns include free screening programs, health risk assessments, and educational workshops on healthy eating, exercise, and the importance of regular check-ups. We also provide basic medication and referrals for complex cases.

Impact on Communities
Initial data from our pilot NCD prevention campaigns shows a significant increase in public awareness and a greater number of individuals seeking early medical attention, leading to better long-term health outcomes.

"Prevention is not just better than cure, it's often the only cure."

Our Approach includes the screening programs, health risk assessments, and educational workshops on healthy eating, exercise, and the importance of regular check-ups. We also provide basic medication and referrals for complex cases.`,
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'The Silent Epidemic', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Non-communicable diseases, hypertension, and cardiovascular diseases are becoming major health concerns. Early detection and lifestyle modifications are critical for effective management of cardiovascular diseases.' }
        },
        {
          id: 'header2',
          type: 'header',
          data: { text: 'Impact on Communities', level: 2 }
        },
        {
          id: 'para2',
          type: 'paragraph',
          data: { text: 'Initial data from our pilot NCD prevention campaigns shows a significant increase in public awareness and a greater number of individuals seeking early medical attention, leading to better long-term health outcomes.' }
        }
      ]
    },
    post_type: 'news',
    author_id: 'dr-misker-kasahun',
    feature_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop',
    video_url: undefined,
    views: 1250,
    likes: 75,
    comments_count: 4,
    is_featured: true,
    tags: 'preventive care,NCDs,diabetes,hypertension,public health',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-04-20T10:00:00Z',
    updated_at: '2024-04-20T10:00:00Z',
    users: {
      id: 'dr-misker-kasahun',
      full_name: 'Dr. Misker Kasahun',
      profile_image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      role: 'admin'
    }
  },
  {
    id: '1',
    title: 'Breaking Barriers: How GIV Society Elevates Reached 50,000 Lives Milestone',
    slug: 'breaking-barriers-giv-society-milestone',
    content: 'We are thrilled to announce that GIV Society has reached a significant milestone of impacting 50,000 lives across Ethiopia through our comprehensive health, education, and emergency aid programs...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'A Journey of Impact and Hope', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Over the past five years, GIV Society has been at the forefront of humanitarian efforts in Ethiopia, working tirelessly to provide essential services to communities in need.' }
        }
      ]
    },
    post_type: 'news',
    author_id: '1',
    feature_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 1250,
    likes: 89,
    comments_count: 23,
    is_featured: true,
    tags: 'milestone,impact,healthcare,education',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    users: {
      id: '1',
      full_name: 'Dr. Sarah Johnson',
      profile_image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      role: 'admin'
    }
  },
  {
    id: '2',
    title: 'Innovative Care Campaign: Tackling Iron Deficiency Diseases',
    slug: 'innovative-care-campaign-iron-deficiency',
    content: 'Our latest campaign focuses on addressing iron deficiency diseases that affect thousands of children and pregnant women in rural Ethiopia...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'Understanding Iron Deficiency', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Iron deficiency is one of the most common nutritional deficiencies worldwide, particularly affecting vulnerable populations in developing countries.' }
        }
      ]
    },
    post_type: 'blog',
    author_id: '2',
    feature_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 890,
    likes: 67,
    comments_count: 15,
    is_featured: false,
    tags: 'healthcare,nutrition,campaign,children',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z',
    users: {
      id: '2',
      full_name: 'Dr. Abebe Tadesse',
      profile_image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      role: 'admin'
    }
  },
  {
    id: '3',
    title: 'Community Health Workers: The Backbone of Healthcare in Rural Ethiopia',
    slug: 'community-health-workers-backbone-healthcare',
    content: 'Meet the dedicated community health workers who are transforming healthcare delivery in remote areas of Ethiopia...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'Heroes in Our Communities', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Community health workers serve as the vital link between healthcare facilities and the communities they serve, providing essential care and education.' }
        }
      ]
    },
    post_type: 'blog',
    author_id: '3',
    feature_image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 654,
    likes: 45,
    comments_count: 12,
    is_featured: false,
    tags: 'healthcare,community,workers,rural',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-10T09:15:00Z',
    users: {
      id: '3',
      full_name: 'Hanan Mohammed',
      profile_image_url: 'https://images.unsplash.com/photo-1594824388853-c0c0e5e5e5e5?w=100&h=100&fit=crop&crop=face',
      role: 'volunteer'
    }
  },
  {
    id: '4',
    title: 'New School Health Eating Nutrition in Schools',
    slug: 'new-school-health-eating-nutrition',
    content: 'Our school nutrition program is making a significant impact on student health and academic performance...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'Nourishing Young Minds', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Proper nutrition is fundamental to children\'s physical and cognitive development, directly impacting their ability to learn and thrive.' }
        }
      ]
    },
    post_type: 'news',
    author_id: '4',
    feature_image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 432,
    likes: 34,
    comments_count: 8,
    is_featured: false,
    tags: 'education,nutrition,schools,children',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-01-08T11:45:00Z',
    updated_at: '2024-01-08T11:45:00Z',
    users: {
      id: '4',
      full_name: 'Almaz Bekele',
      profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      role: 'admin'
    }
  },
  {
    id: '5',
    title: 'The Power of Education: Celebrating Speech Nutrition with Beneficiaries',
    slug: 'power-education-celebrating-speech-nutrition',
    content: 'Join us as we celebrate the achievements of our education program beneficiaries and their inspiring stories...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'Stories of Transformation', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Education has the power to transform lives, break cycles of poverty, and create opportunities for entire communities.' }
        }
      ]
    },
    post_type: 'blog',
    author_id: '5',
    feature_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 789,
    likes: 56,
    comments_count: 19,
    is_featured: true,
    tags: 'education,beneficiaries,success,stories',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-01-05T16:20:00Z',
    updated_at: '2024-01-05T16:20:00Z',
    users: {
      id: '5',
      full_name: 'Yohannes Girma',
      profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      role: 'volunteer'
    }
  },
  {
    id: '6',
    title: 'New Wave: Quality Care & New Institute in the Air Region',
    slug: 'new-wave-quality-care-institute-air-region',
    content: 'We are proud to announce the opening of our new healthcare institute in the Air Region, bringing quality medical care closer to communities...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'Expanding Healthcare Access', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Our new institute represents a significant step forward in our mission to provide accessible, quality healthcare to all Ethiopians.' }
        }
      ]
    },
    post_type: 'news',
    author_id: '1',
    feature_image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 567,
    likes: 42,
    comments_count: 14,
    is_featured: false,
    tags: 'healthcare,institute,access,quality',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-01-03T13:10:00Z',
    updated_at: '2024-01-03T13:10:00Z',
    users: {
      id: '1',
      full_name: 'Dr. Sarah Johnson',
      profile_image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      role: 'admin'
    }
  },
  {
    id: '7',
    title: 'Explore Readers: The First Inspirational Volunteer Stories on the Frontlines',
    slug: 'explore-readers-inspirational-volunteer-stories',
    content: 'Discover the incredible stories of our volunteers who work tirelessly on the frontlines to make a difference in their communities...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'Frontline Heroes', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Our volunteers are the heart and soul of GIV Society, dedicating their time and energy to serve those in need.' }
        }
      ]
    },
    post_type: 'blog',
    author_id: '6',
    feature_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 345,
    likes: 28,
    comments_count: 7,
    is_featured: false,
    tags: 'volunteers,stories,inspiration,frontlines',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2024-01-01T08:30:00Z',
    updated_at: '2024-01-01T08:30:00Z',
    users: {
      id: '6',
      full_name: 'Meron Tesfaye',
      profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e6?w=100&h=100&fit=crop&crop=face',
      role: 'volunteer'
    }
  },
  {
    id: '8',
    title: 'Improving Diseases Medical and Child Health Indicators',
    slug: 'improving-diseases-medical-child-health-indicators',
    content: 'Our comprehensive approach to improving child health indicators is showing remarkable results across our program areas...',
    content_blocks: {
      version: '2.28.2',
      blocks: [
        {
          id: 'header1',
          type: 'header',
          data: { text: 'Measuring Our Impact', level: 2 }
        },
        {
          id: 'para1',
          type: 'paragraph',
          data: { text: 'Through systematic monitoring and evaluation, we track key health indicators to ensure our programs are making a real difference.' }
        }
      ]
    },
    post_type: 'news',
    author_id: '2',
    feature_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    video_url: undefined,
    views: 678,
    likes: 51,
    comments_count: 16,
    is_featured: false,
    tags: 'health,indicators,children,medical',
    language: 'en',
    translation_group_id: undefined,
    created_at: '2023-12-28T15:45:00Z',
    updated_at: '2023-12-28T15:45:00Z',
    users: {
      id: '2',
      full_name: 'Dr. Abebe Tadesse',
      profile_image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      role: 'admin'
    }
  }
];

// Mock Comments Data
export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment-preventive-1',
    post_id: 'preventive-care-campaigns',
    user_id: 'dr-ayele-bekele',
    content: 'This is an excellent about I\'ve been working with GIV Society for two years now, and seeing the impact of these campaigns is truly remarkable. The dedication of our team and the gratitude of the communities we serve keeps me motivated every day.',
    parent_id: undefined,
    is_approved: true,
    created_at: '2024-04-20T14:30:00Z',
    updated_at: '2024-04-20T14:30:00Z',
    users: {
      id: 'dr-ayele-bekele',
      full_name: 'Dr. Ayele Bekele',
      profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      role: 'volunteer'
    },
    children: [
      {
        id: 'reply-preventive-1',
        post_id: 'preventive-care-campaigns',
        user_id: 'samuel-tadesse',
        content: 'Thank you Dr. Ayele! Your contributions to our community health initiatives have been invaluable. It\'s volunteers like you who make these milestones possible.',
        parent_id: 'comment-preventive-1',
        is_approved: true,
        created_at: '2024-04-20T15:45:00Z',
        updated_at: '2024-04-20T15:45:00Z',
        users: {
          id: 'samuel-tadesse',
          full_name: 'Samuel Tadesse',
          profile_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          role: 'admin'
        }
      }
    ]
  },
  {
    id: 'comment-preventive-2',
    post_id: 'preventive-care-campaigns',
    user_id: 'almaz-tadesse',
    content: 'I love one of the beneficiaries of the health screening campaign mentioned in this article. The care and compassion shown by the GIV Society team was exceptional. They didn\'t just treat my condition; they educated me about prevention and follow-up care.',
    parent_id: undefined,
    is_approved: true,
    created_at: '2024-04-20T16:20:00Z',
    updated_at: '2024-04-20T16:20:00Z',
    users: {
      id: 'almaz-tadesse',
      full_name: 'Almaz Tadesse',
      profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e6?w=50&h=50&fit=crop&crop=face',
      role: 'user'
    }
  },
  {
    id: 'comment-preventive-3',
    post_id: 'preventive-care-campaigns',
    user_id: 'dr-meron-assefa',
    content: 'What strikes me most about this initiative is not just the medical care, but the quality of care we provide. Each of those 50,000 individuals received personalized attention and follow-up care. That\'s what sets our approach apart.',
    parent_id: undefined,
    is_approved: true,
    created_at: '2024-04-20T18:10:00Z',
    updated_at: '2024-04-20T18:10:00Z',
    users: {
      id: 'dr-meron-assefa',
      full_name: 'Dr. Meron Assefa',
      profile_image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face',
      role: 'admin'
    }
  },
  {
    id: 'comment-preventive-4',
    post_id: 'preventive-care-campaigns',
    user_id: 'hanan-mohammed',
    content: 'I absolutely agree Dr. Meron. The holistic approach to healthcare - combining immediate care with education and follow-up - is what this organization apart. I\'ve seen how this approach has transformed entire families, not just individual patients.',
    parent_id: undefined,
    is_approved: true,
    created_at: '2024-04-20T19:30:00Z',
    updated_at: '2024-04-20T19:30:00Z',
    users: {
      id: 'hanan-mohammed',
      full_name: 'Hanan Mohammed',
      profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      role: 'volunteer'
    }
  },
  {
    id: '1',
    post_id: '1',
    user_id: '101',
    content: 'This is incredible news! Thank you for all the amazing work you do.',
    parent_id: undefined,
    is_approved: true,
    created_at: '2024-01-16T09:30:00Z',
    updated_at: '2024-01-16T09:30:00Z',
    users: {
      id: '101',
      full_name: 'Alem Teshome',
      profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      role: 'user'
    },
    children: [
      {
        id: '2',
        post_id: '1',
        user_id: '1',
        content: 'Thank you for your support! Together we can achieve even more.',
        parent_id: '1',
        is_approved: true,
        created_at: '2024-01-16T10:15:00Z',
        updated_at: '2024-01-16T10:15:00Z',
        users: {
          id: '1',
          full_name: 'Dr. Sarah Johnson',
          profile_image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face',
          role: 'admin'
        }
      }
    ]
  },
  {
    id: '3',
    post_id: '1',
    user_id: '102',
    content: 'How can I get involved as a volunteer?',
    parent_id: undefined,
    is_approved: true,
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z',
    users: {
      id: '102',
      full_name: 'Bekele Worku',
      profile_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      role: 'user'
    }
  },
  {
    id: '4',
    post_id: '2',
    user_id: '103',
    content: 'Iron deficiency is such an important issue. Great to see this being addressed.',
    parent_id: undefined,
    is_approved: true,
    created_at: '2024-01-13T14:20:00Z',
    updated_at: '2024-01-13T14:20:00Z',
    users: {
      id: '103',
      full_name: 'Hanan Ahmed',
      profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e6?w=50&h=50&fit=crop&crop=face',
      role: 'user'
    }
  }
];

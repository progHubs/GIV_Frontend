import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { 
  Post, 
  Comment, 
  PostQueryParams, 
  ContentManagementState,
  CommentManagementState,
  UploadConfig 
} from '../types/content';

// ===================================
// TYPES
// ===================================

interface ContentContextState {
  posts: ContentManagementState;
  comments: CommentManagementState;
  uploadConfig?: UploadConfig;
  selectedPost?: Post;
  searchQuery: string;
  activeFilters: PostQueryParams;
}

type ContentAction =
  | { type: 'SET_POSTS_LOADING'; payload: boolean }
  | { type: 'SET_POSTS'; payload: { posts: Post[]; pagination?: any } }
  | { type: 'SET_POSTS_ERROR'; payload: string }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'REMOVE_POST'; payload: string }
  | { type: 'SET_SELECTED_POST'; payload: Post | undefined }
  | { type: 'SET_COMMENTS_LOADING'; payload: boolean }
  | { type: 'SET_COMMENTS'; payload: { comments: Comment[]; pagination?: any } }
  | { type: 'SET_COMMENTS_ERROR'; payload: string }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'UPDATE_COMMENT'; payload: Comment }
  | { type: 'REMOVE_COMMENT'; payload: string }
  | { type: 'SET_UPLOAD_CONFIG'; payload: UploadConfig }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_ACTIVE_FILTERS'; payload: PostQueryParams }
  | { type: 'RESET_FILTERS' }
  | { type: 'RESET_STATE' };

interface ContentContextValue {
  state: ContentContextState;
  actions: {
    // Post actions
    setPostsLoading: (loading: boolean) => void;
    setPosts: (posts: Post[], pagination?: any) => void;
    setPostsError: (error: string) => void;
    addPost: (post: Post) => void;
    updatePost: (post: Post) => void;
    removePost: (postId: string) => void;
    setSelectedPost: (post: Post | undefined) => void;
    
    // Comment actions
    setCommentsLoading: (loading: boolean) => void;
    setComments: (comments: Comment[], pagination?: any) => void;
    setCommentsError: (error: string) => void;
    addComment: (comment: Comment) => void;
    updateComment: (comment: Comment) => void;
    removeComment: (commentId: string) => void;
    
    // Upload actions
    setUploadConfig: (config: UploadConfig) => void;
    
    // Search and filter actions
    setSearchQuery: (query: string) => void;
    setActiveFilters: (filters: PostQueryParams) => void;
    resetFilters: () => void;
    
    // General actions
    resetState: () => void;
  };
}

// ===================================
// INITIAL STATE
// ===================================

const initialState: ContentContextState = {
  posts: {
    posts: [],
    isLoading: false,
    error: undefined,
    pagination: undefined,
    filters: {},
  },
  comments: {
    comments: [],
    isLoading: false,
    error: undefined,
    pagination: undefined,
  },
  uploadConfig: undefined,
  selectedPost: undefined,
  searchQuery: '',
  activeFilters: {},
};

// ===================================
// REDUCER
// ===================================

const contentReducer = (state: ContentContextState, action: ContentAction): ContentContextState => {
  switch (action.type) {
    case 'SET_POSTS_LOADING':
      return {
        ...state,
        posts: {
          ...state.posts,
          isLoading: action.payload,
          error: action.payload ? undefined : state.posts.error,
        },
      };

    case 'SET_POSTS':
      return {
        ...state,
        posts: {
          ...state.posts,
          posts: action.payload.posts,
          pagination: action.payload.pagination,
          isLoading: false,
          error: undefined,
        },
      };

    case 'SET_POSTS_ERROR':
      return {
        ...state,
        posts: {
          ...state.posts,
          error: action.payload,
          isLoading: false,
        },
      };

    case 'ADD_POST':
      return {
        ...state,
        posts: {
          ...state.posts,
          posts: [action.payload, ...state.posts.posts],
        },
      };

    case 'UPDATE_POST':
      return {
        ...state,
        posts: {
          ...state.posts,
          posts: state.posts.posts.map(post =>
            post.id === action.payload.id ? action.payload : post
          ),
        },
        selectedPost: state.selectedPost?.id === action.payload.id ? action.payload : state.selectedPost,
      };

    case 'REMOVE_POST':
      return {
        ...state,
        posts: {
          ...state.posts,
          posts: state.posts.posts.filter(post => post.id !== action.payload),
        },
        selectedPost: state.selectedPost?.id === action.payload ? undefined : state.selectedPost,
      };

    case 'SET_SELECTED_POST':
      return {
        ...state,
        selectedPost: action.payload,
      };

    case 'SET_COMMENTS_LOADING':
      return {
        ...state,
        comments: {
          ...state.comments,
          isLoading: action.payload,
          error: action.payload ? undefined : state.comments.error,
        },
      };

    case 'SET_COMMENTS':
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: action.payload.comments,
          pagination: action.payload.pagination,
          isLoading: false,
          error: undefined,
        },
      };

    case 'SET_COMMENTS_ERROR':
      return {
        ...state,
        comments: {
          ...state.comments,
          error: action.payload,
          isLoading: false,
        },
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: [action.payload, ...state.comments.comments],
        },
      };

    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: state.comments.comments.map(comment =>
            comment.id === action.payload.id ? action.payload : comment
          ),
        },
      };

    case 'REMOVE_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: state.comments.comments.filter(comment => comment.id !== action.payload),
        },
      };

    case 'SET_UPLOAD_CONFIG':
      return {
        ...state,
        uploadConfig: action.payload,
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_ACTIVE_FILTERS':
      return {
        ...state,
        activeFilters: action.payload,
        posts: {
          ...state.posts,
          filters: action.payload,
        },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        activeFilters: {},
        searchQuery: '',
        posts: {
          ...state.posts,
          filters: {},
        },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
};

// ===================================
// CONTEXT
// ===================================

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

// ===================================
// PROVIDER
// ===================================

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(contentReducer, initialState);

  // Post actions
  const setPostsLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_POSTS_LOADING', payload: loading });
  }, []);

  const setPosts = useCallback((posts: Post[], pagination?: any) => {
    dispatch({ type: 'SET_POSTS', payload: { posts, pagination } });
  }, []);

  const setPostsError = useCallback((error: string) => {
    dispatch({ type: 'SET_POSTS_ERROR', payload: error });
  }, []);

  const addPost = useCallback((post: Post) => {
    dispatch({ type: 'ADD_POST', payload: post });
  }, []);

  const updatePost = useCallback((post: Post) => {
    dispatch({ type: 'UPDATE_POST', payload: post });
  }, []);

  const removePost = useCallback((postId: string) => {
    dispatch({ type: 'REMOVE_POST', payload: postId });
  }, []);

  const setSelectedPost = useCallback((post: Post | undefined) => {
    dispatch({ type: 'SET_SELECTED_POST', payload: post });
  }, []);

  // Comment actions
  const setCommentsLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_COMMENTS_LOADING', payload: loading });
  }, []);

  const setComments = useCallback((comments: Comment[], pagination?: any) => {
    dispatch({ type: 'SET_COMMENTS', payload: { comments, pagination } });
  }, []);

  const setCommentsError = useCallback((error: string) => {
    dispatch({ type: 'SET_COMMENTS_ERROR', payload: error });
  }, []);

  const addComment = useCallback((comment: Comment) => {
    dispatch({ type: 'ADD_COMMENT', payload: comment });
  }, []);

  const updateComment = useCallback((comment: Comment) => {
    dispatch({ type: 'UPDATE_COMMENT', payload: comment });
  }, []);

  const removeComment = useCallback((commentId: string) => {
    dispatch({ type: 'REMOVE_COMMENT', payload: commentId });
  }, []);

  // Upload actions
  const setUploadConfig = useCallback((config: UploadConfig) => {
    dispatch({ type: 'SET_UPLOAD_CONFIG', payload: config });
  }, []);

  // Search and filter actions
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setActiveFilters = useCallback((filters: PostQueryParams) => {
    dispatch({ type: 'SET_ACTIVE_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  // General actions
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const contextValue: ContentContextValue = {
    state,
    actions: {
      setPostsLoading,
      setPosts,
      setPostsError,
      addPost,
      updatePost,
      removePost,
      setSelectedPost,
      setCommentsLoading,
      setComments,
      setCommentsError,
      addComment,
      updateComment,
      removeComment,
      setUploadConfig,
      setSearchQuery,
      setActiveFilters,
      resetFilters,
      resetState,
    },
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

// ===================================
// HOOK
// ===================================

export const useContentContext = (): ContentContextValue => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
};

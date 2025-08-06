/**
 * EditorJS React Renderer Component
 * Renders Editor.js JSON data using @editorjs/react-renderer with custom styling
 */

import React from 'react';
import Output from 'editorjs-react-renderer';
import type { ContentBlocks } from '../../types/content';

// ===================================
// INTERFACES
// ===================================

interface EditorJSRendererProps {
  data: ContentBlocks;
  className?: string;
  useTailwindProse?: boolean;
  darkMode?: boolean;
}

// ===================================
// CUSTOM RENDERERS
// ===================================

/**
 * Custom Table Renderer
 * Handles table blocks with proper styling and HTML content parsing
 */
const CustomTableRenderer = ({ data, style, classNames, config }: any) => {
  if (!data?.content || !Array.isArray(data.content)) {
    return null;
  }

  const { withHeadings = false } = data;
  const tableContent = data.content;

  // Helper function to render cell content with HTML parsing
  const renderCellContent = (cellContent: string) => {
    if (typeof cellContent !== 'string') {
      return cellContent;
    }

    // Check if content contains HTML tags
    if (cellContent.includes('<') && cellContent.includes('>')) {
      return <span dangerouslySetInnerHTML={{ __html: cellContent }} />;
    }

    return cellContent;
  };

  return (
    <div className={`table-wrapper overflow-x-auto my-4 ${classNames?.container || ''}`} style={style?.container}>
      <table className={`min-w-full border-collapse border border-gray-300 text-sm ${classNames?.table || ''}`} style={style?.table}>
        {withHeadings && tableContent.length > 0 && (
          <thead>
            <tr className={classNames?.tr || ''} style={style?.tr}>
              {tableContent[0].map((cell: string, index: number) => (
                <th
                  key={index}
                  className={`border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-left text-sm ${classNames?.th || ''}`}
                  style={style?.th}
                >
                  {renderCellContent(cell)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {(withHeadings ? tableContent.slice(1) : tableContent).map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className={classNames?.tr || ''} style={style?.tr}>
              {row.map((cell: string, cellIndex: number) => (
                <td
                  key={cellIndex}
                  className={`border border-gray-300 px-3 py-2 text-sm ${classNames?.td || ''}`}
                  style={style?.td}
                >
                  {renderCellContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Custom Delimiter Renderer
 * Renders a visual separator
 */
const CustomDelimiterRenderer = ({ style, classNames }: any) => {
  return (
    <div className={`delimiter-wrapper flex justify-center my-8 ${classNames?.container || ''}`} style={style?.container}>
      <div className={`delimiter-line w-16 h-1 bg-gray-300 rounded ${classNames?.line || ''}`} style={style?.line}>
        <svg
          className={`w-full h-full ${classNames?.svg || ''}`}
          style={style?.svg}
          viewBox="0 0 64 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={classNames?.path || ''}
            style={style?.path}
            d="M0 2h64"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

/**
 * Custom Quote Renderer
 * Enhanced quote renderer with background and better caption styling
 */
const CustomQuoteRenderer = ({ data, style, classNames }: any) => {
  if (!data?.text) {
    return null;
  }

  const { text, caption, alignment = 'left' } = data;

  return (
    <blockquote
      className={`quote-block my-4 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-md ${classNames?.container || ''}`}
      style={style?.container}
    >
      <div
        className={`quote-text text-sm italic text-gray-700 dark:text-gray-300 leading-relaxed ${classNames?.content || ''}`}
        style={style?.content}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {caption && (
        <cite
          className={`quote-caption block mt-2 text-xs text-gray-500 dark:text-gray-400 not-italic font-medium ${classNames?.author || ''}`}
          style={style?.author}
        >
          — {caption}
        </cite>
      )}
    </blockquote>
  );
};

/**
 * Custom List Renderer
 * Enhanced list renderer with proper markers and responsive spacing
 */
const CustomListRenderer = ({ data, style, classNames }: any) => {
  if (!data?.items || !Array.isArray(data.items)) {
    return null;
  }

  const { style: listStyle = 'unordered', items } = data;
  const ListTag = listStyle === 'ordered' ? 'ol' : 'ul';

  // Force list styles to ensure visibility
  const baseListClasses = listStyle === 'ordered'
    ? 'list-decimal list-outside pl-4 sm:pl-6 space-y-0.5 sm:space-y-1 text-xs sm:text-sm my-2 sm:my-3'
    : 'list-disc list-outside pl-4 sm:pl-6 space-y-0.5 sm:space-y-1 text-xs sm:text-sm my-2 sm:my-3';

  const listStyles = {
    ...style?.container,
    listStyleType: listStyle === 'ordered' ? 'decimal' : 'disc',
    listStylePosition: 'outside',
    paddingLeft: '1rem',
    marginLeft: '0.5rem',
  };

  return (
    <ListTag
      className={`${baseListClasses} ${classNames?.container || ''}`}
      style={listStyles}
    >
      {items.map((item: string, index: number) => (
        <li
          key={index}
          className={`text-gray-900 dark:text-gray-100 leading-relaxed ml-0 ${classNames?.listItem || ''}`}
          style={{
            ...style?.listItem,
            display: 'list-item',
            listStyleType: 'inherit',
            listStylePosition: 'outside',
          }}
          dangerouslySetInnerHTML={{ __html: item }}
        />
      ))}
    </ListTag>
  );
};

/**
 * Custom Header Renderer
 * Enhanced header renderer with proper Tailwind styling
 */
const CustomHeaderRenderer = ({ data, style, classNames }: any) => {
  if (!data?.text) {
    return null;
  }

  const { text, level = 2 } = data;
  const validLevel = Math.min(Math.max(level, 1), 6);
  const HeaderTag = `h${validLevel}` as keyof JSX.IntrinsicElements;

  // Define header classes based on level with proper responsive sizing
  const getHeaderClasses = (level: number) => {
    const baseClasses = 'font-bold text-gray-900 dark:text-gray-100 leading-tight';
    switch (level) {
      case 1:
        return `${baseClasses} text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4`;
      case 2:
        return `${baseClasses} text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3`;
      case 3:
        return `${baseClasses} text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3`;
      case 4:
        return `${baseClasses} text-sm sm:text-base font-semibold mb-1 sm:mb-2`;
      case 5:
        return `${baseClasses} text-xs sm:text-sm font-medium mb-1 sm:mb-2`;
      case 6:
        return `${baseClasses} text-xs sm:text-sm font-medium mb-1`;
      default:
        return `${baseClasses} text-base sm:text-lg mb-2 sm:mb-3`;
    }
  };

  return (
    <HeaderTag
      className={`${getHeaderClasses(validLevel)} ${classNames?.header || ''}`}
      style={style?.header}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

/**
 * Custom Image Renderer
 * Enhanced image renderer with responsive sizing, background support and centering
 */
const CustomImageRenderer = ({ data, style, classNames }: any) => {
  if (!data?.file?.url) {
    return null;
  }

  const {
    file,
    caption,
    withBorder = false,
    withBackground = false,
    stretched = false
  } = data;

  // Responsive image classes with size constraints
  const imageClasses = [
    'rounded-md sm:rounded-lg shadow-sm sm:shadow-md',
    'w-full h-auto object-cover',
    'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl',
    stretched ? 'max-w-full' : '',
    withBorder ? 'border border-gray-300 dark:border-gray-600' : '',
    classNames?.img || ''
  ].filter(Boolean).join(' ');

  // Figure classes with centering and background
  const figureClasses = [
    'image-figure my-2 sm:my-4 mx-auto text-center',
    'max-w-full flex flex-col items-center',
    withBackground ? 'p-2 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg' : '',
    classNames?.figure || ''
  ].filter(Boolean).join(' ');

  // Container for centering the image within background
  const imageContainerClasses = withBackground
    ? 'flex justify-center items-center w-full'
    : 'w-full flex justify-center';

  return (
    <figure className={figureClasses} style={style?.figure}>
      <div className={imageContainerClasses}>
        <img
          src={file.url}
          alt={caption || ''}
          className={imageClasses}
          style={style?.img}
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption
          className={`image-caption mt-1 sm:mt-2 text-xs text-gray-600 dark:text-gray-400 text-center px-2 ${classNames?.figcaption || ''}`}
          style={style?.figcaption}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * Custom Embed Renderer
 * Enhanced embed renderer with better service support
 */
const CustomEmbedRenderer = ({ data, style, classNames }: any) => {
  if (!data?.source && !data?.embed) {
    return null;
  }

  const { service, source, embed, width = 580, height = 320, caption } = data;

  let embedContent = null;

  // Handle different embed services
  switch (service?.toLowerCase()) {
    case 'youtube':
      const youtubeId = extractYouTubeId(source);
      if (youtubeId) {
        embedContent = (
          <iframe
            width={width}
            height={height}
            src={`https://www.youtube.com/embed/${youtubeId}`}
            frameBorder="0"
            allowFullScreen
            className={`w-full ${classNames?.iframe || ''}`}
            style={style?.iframe}
          />
        );
      }
      break;
    case 'vimeo':
      const vimeoId = extractVimeoId(source);
      if (vimeoId) {
        embedContent = (
          <iframe
            width={width}
            height={height}
            src={`https://player.vimeo.com/video/${vimeoId}`}
            frameBorder="0"
            allowFullScreen
            className={`w-full ${classNames?.iframe || ''}`}
            style={style?.iframe}
          />
        );
      }
      break;
    case 'twitter':
      embedContent = (
        <div className={`twitter-embed ${classNames?.twitter || ''}`} style={style?.twitter}>
          <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            View Tweet
          </a>
        </div>
      );
      break;
    default:
      // Generic embed or custom HTML
      if (embed) {
        embedContent = (
          <div
            className={`generic-embed ${classNames?.generic || ''}`}
            style={style?.generic}
            dangerouslySetInnerHTML={{ __html: embed }}
          />
        );
      } else if (source) {
        // For unknown services, create a simple link
        embedContent = (
          <div className={`embed-fallback p-4 border border-gray-300 rounded ${classNames?.fallback || ''}`} style={style?.fallback}>
            <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Content: {source}
            </a>
          </div>
        );
      }
  }

  if (!embedContent) {
    return (
      <div className={`embed-fallback p-3 border border-gray-300 rounded text-sm ${classNames?.fallback || ''}`} style={style?.fallback}>
        <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          View Content
        </a>
      </div>
    );
  }

  return (
    <figure className={`embed-figure my-4 ${classNames?.figure || ''}`} style={style?.figure}>
      <div className={`embed-container ${classNames?.container || ''}`} style={style?.container}>
        {embedContent}
      </div>
      {caption && (
        <figcaption className={`embed-caption mt-2 text-xs text-gray-600 dark:text-gray-400 text-center ${classNames?.caption || ''}`} style={style?.caption}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Extract YouTube video ID from URL
 */
const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Extract Vimeo video ID from URL
 */
const extractVimeoId = (url: string): string | null => {
  const regex = /vimeo\.com\/(?:.*#|.*\/)?([0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// ===================================
// STYLING CONFIGURATIONS
// ===================================

/**
 * Tailwind Prose Styles - Ultra minimized font sizes with full responsiveness
 */
const getTailwindProseStyles = (darkMode: boolean = false) => ({
  paragraph: `text-xs sm:text-sm md:text-base leading-relaxed text-gray-900 mb-2 sm:mb-3 ${darkMode ? 'dark:text-gray-100' : ''}`,
  header: {
    h1: `text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 ${darkMode ? 'dark:text-gray-100' : ''}`,
    h2: `text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3 ${darkMode ? 'dark:text-gray-100' : ''}`,
    h3: `text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-1 sm:mb-2 ${darkMode ? 'dark:text-gray-100' : ''}`,
    h4: `text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2 ${darkMode ? 'dark:text-gray-100' : ''}`,
    h5: `text-xs font-medium text-gray-900 mb-1 sm:mb-2 ${darkMode ? 'dark:text-gray-100' : ''}`,
    h6: `text-xs font-medium text-gray-900 mb-1 ${darkMode ? 'dark:text-gray-100' : ''}`,
  },
  list: {
    container: `space-y-1 text-xs sm:text-sm my-2 sm:my-3 pl-3 sm:pl-4 ${darkMode ? 'dark:text-gray-100' : 'text-gray-900'}`,
    listItem: `leading-relaxed ${darkMode ? 'dark:text-gray-100' : 'text-gray-900'}`,
  },
  quote: {
    container: `border-l-2 sm:border-l-4 border-blue-500 pl-2 sm:pl-4 my-3 sm:my-4 p-2 sm:p-4 bg-gray-50 rounded-r-md ${darkMode ? 'dark:border-blue-400 dark:bg-gray-800' : ''}`,
    content: `text-xs sm:text-sm italic leading-relaxed ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'}`,
    author: `text-xs font-medium not-italic mt-1 sm:mt-2 block ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`,
  },
  image: {
    img: 'rounded-md sm:rounded-lg shadow-sm sm:shadow-md w-full h-auto object-cover',
    figure: 'my-2 sm:my-4 mx-auto',
    figcaption: `text-xs text-center mt-1 sm:mt-2 px-2 ${darkMode ? 'dark:text-gray-400' : 'text-gray-600'}`,
  },
  table: {
    container: 'overflow-x-auto my-2 sm:my-4 -mx-2 sm:mx-0',
    table: 'min-w-full border-collapse border border-gray-300 text-xs sm:text-sm',
    th: `border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 bg-gray-50 font-semibold text-left text-xs sm:text-sm ${darkMode ? 'dark:bg-gray-700 dark:text-gray-100' : ''}`,
    td: `border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${darkMode ? 'dark:text-gray-100' : ''}`,
    tr: '',
  },
  embed: {
    figure: 'my-2 sm:my-4 mx-auto',
    container: 'relative w-full',
    iframe: 'w-full h-[450px] rounded-md sm:rounded-lg',
    caption: `text-xs text-center mt-1 sm:mt-2 px-2 ${darkMode ? 'dark:text-gray-400' : 'text-gray-600'}`,
  },
  delimiter: {
    container: 'flex justify-center my-4 sm:my-6',
    line: 'w-12 sm:w-16 h-0.5 sm:h-1 bg-gray-300 rounded',
  },
});

/**
 * Fallback CSS Styles (when Tailwind is not available) - Ultra minimized with responsiveness
 */
const getFallbackStyles = (darkMode: boolean = false) => ({
  paragraph: {
    color: darkMode ? '#f3f4f6' : '#1f2937',
    fontSize: '0.75rem',
    lineHeight: '1.5',
    marginBottom: '0.5rem',
    '@media (min-width: 640px)': {
      fontSize: '0.875rem',
      lineHeight: '1.6',
      marginBottom: '0.75rem',
    },
  },
  header: {
    h1: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      marginBottom: '0.5rem',
      '@media (min-width: 640px)': {
        fontSize: '1rem',
        marginBottom: '0.75rem',
      },
      '@media (min-width: 768px)': {
        fontSize: '1.125rem',
      },
    },
    h2: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      marginBottom: '0.5rem',
      '@media (min-width: 640px)': {
        fontSize: '1rem',
        marginBottom: '0.75rem',
      },
    },
    h3: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      marginBottom: '0.25rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
        marginBottom: '0.5rem',
      },
      '@media (min-width: 768px)': {
        fontSize: '1rem',
      },
    },
    h4: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      marginBottom: '0.25rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
        marginBottom: '0.5rem',
      },
    },
    h5: {
      fontSize: '0.75rem',
      fontWeight: '500',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      marginBottom: '0.25rem',
      '@media (min-width: 640px)': {
        marginBottom: '0.5rem',
      },
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: '500',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      marginBottom: '0.25rem',
    },
  },
  list: {
    container: {
      paddingLeft: '0.75rem',
      marginBottom: '0.5rem',
      fontSize: '0.75rem',
      listStyleType: 'disc',
      listStylePosition: 'inside',
      '@media (min-width: 640px)': {
        paddingLeft: '1rem',
        marginBottom: '0.75rem',
        fontSize: '0.875rem',
      },
    },
    listItem: {
      color: darkMode ? '#f3f4f6' : '#1f2937',
      marginBottom: '0.125rem',
      lineHeight: '1.5',
      '@media (min-width: 640px)': {
        marginBottom: '0.25rem',
        lineHeight: '1.6',
      },
    },
  },
  quote: {
    container: {
      borderLeft: `2px solid ${darkMode ? '#60a5fa' : '#3b82f6'}`,
      paddingLeft: '0.5rem',
      padding: '0.5rem',
      backgroundColor: darkMode ? '#374151' : '#f9fafb',
      borderRadius: '0 0.25rem 0.25rem 0',
      fontStyle: 'italic',
      marginBottom: '0.75rem',
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        borderLeft: `4px solid ${darkMode ? '#60a5fa' : '#3b82f6'}`,
        paddingLeft: '1rem',
        padding: '1rem',
        borderRadius: '0 0.375rem 0.375rem 0',
        marginBottom: '1rem',
        fontSize: '0.875rem',
      },
    },
    content: {
      color: darkMode ? '#d1d5db' : '#374151',
      lineHeight: '1.5',
      '@media (min-width: 640px)': {
        lineHeight: '1.6',
      },
    },
    author: {
      fontSize: '0.75rem',
      color: darkMode ? '#9ca3af' : '#6b7280',
      fontStyle: 'normal',
      fontWeight: '500',
      marginTop: '0.25rem',
      display: 'block',
      '@media (min-width: 640px)': {
        marginTop: '0.5rem',
      },
    },
  },
  image: {
    img: {
      borderRadius: '0.25rem',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '300px',
      height: 'auto',
      objectFit: 'cover' as const,
      '@media (min-width: 640px)': {
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
      },
      '@media (min-width: 768px)': {
        maxWidth: '600px',
      },
    },
    figure: {
      margin: '0.5rem auto',
      textAlign: 'center' as const,
      '@media (min-width: 640px)': {
        margin: '1rem auto',
      },
    },
    figcaption: {
      fontSize: '0.75rem',
      color: darkMode ? '#9ca3af' : '#6b7280',
      textAlign: 'center' as const,
      marginTop: '0.25rem',
      padding: '0 0.5rem',
      '@media (min-width: 640px)': {
        marginTop: '0.5rem',
      },
    },
  },
  table: {
    container: {
      overflowX: 'auto',
      margin: '0.5rem -0.5rem',
      '@media (min-width: 640px)': {
        margin: '1rem 0',
      },
    },
    table: {
      minWidth: '100%',
      borderCollapse: 'collapse' as const,
      border: '1px solid #d1d5db',
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
      },
    },
    th: {
      border: '1px solid #d1d5db',
      padding: '0.5rem',
      backgroundColor: darkMode ? '#374151' : '#f9fafb',
      fontWeight: '600',
      textAlign: 'left' as const,
      fontSize: '0.75rem',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      '@media (min-width: 640px)': {
        padding: '0.75rem',
        fontSize: '0.875rem',
      },
    },
    td: {
      border: '1px solid #d1d5db',
      padding: '0.5rem',
      fontSize: '0.75rem',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      '@media (min-width: 640px)': {
        padding: '0.75rem',
        fontSize: '0.875rem',
      },
    },
    tr: {},
  },
});

// ===================================
// MAIN COMPONENT
// ===================================

const EditorJSRenderer: React.FC<EditorJSRendererProps> = ({
  data,
  className = '',
  useTailwindProse = true,
  darkMode = false,
}) => {
  // Validate and sanitize data structure
  if (!data?.blocks || !Array.isArray(data.blocks)) {
    return (
      <div className={`editor-content-empty text-gray-500 italic ${className}`}>
        No content to display.
      </div>
    );
  }

  // Sanitize blocks to ensure they have valid structure
  const sanitizedData = {
    ...data,
    blocks: data.blocks.filter(block => {
      // Ensure block has required properties
      if (!block || typeof block !== 'object') return false;
      if (!block.type || typeof block.type !== 'string') return false;
      if (!block.data || typeof block.data !== 'object') return false;

      // Ensure block has an ID
      if (!block.id) {
        block.id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Validate specific block types
      switch (block.type) {
        case 'paragraph':
          if (typeof block.data.text !== 'string') return false;
          break;
        case 'header':
          if (typeof block.data.text !== 'string') return false;
          if (block.data.level && (typeof block.data.level !== 'number' || block.data.level < 1 || block.data.level > 6)) {
            block.data.level = 2; // Default to h2
          }
          break;
        case 'list':
          if (!Array.isArray(block.data.items)) return false;
          break;
        case 'image':
          if (!block.data.file || typeof block.data.file.url !== 'string') return false;
          break;
        case 'quote':
          if (typeof block.data.text !== 'string') return false;
          break;
        case 'table':
          if (!Array.isArray(block.data.content)) return false;
          break;
        case 'delimiter':
          // Delimiter blocks don't need specific data validation
          break;
        case 'embed':
          if (!block.data.source && !block.data.embed) return false;
          break;
        default:
          console.warn(`Unknown block type: ${block.type}`);
          return false;
      }

      return true;
    })
  };

  // If no valid blocks remain, show empty state
  if (sanitizedData.blocks.length === 0) {
    return (
      <div className={`editor-content-empty text-gray-500 italic ${className}`}>
        No valid content to display.
      </div>
    );
  }

  // Custom renderers for unsupported or enhanced blocks
  const customRenderers = {
    header: CustomHeaderRenderer,
    table: CustomTableRenderer,
    delimiter: CustomDelimiterRenderer,
    embed: CustomEmbedRenderer,
    quote: CustomQuoteRenderer,
    list: CustomListRenderer,
    image: CustomImageRenderer,
  };

  // Get styling configuration
  const styles = useTailwindProse ? getTailwindProseStyles(darkMode) : undefined;
  const fallbackStyles = !useTailwindProse ? getFallbackStyles(darkMode) : undefined;

  // Configuration for the renderer
  const config = {
    disableDefaultStyle: useTailwindProse, // Disable default styles when using Tailwind
  };

  // Prepare the wrapper classes with full responsiveness
  const wrapperClasses = useTailwindProse
    ? `prose prose-sm sm:prose-base max-w-none w-full ${darkMode ? 'prose-invert' : ''}
       prose-headings:text-xs prose-headings:sm:text-sm prose-headings:md:text-base
       prose-p:text-xs prose-p:sm:text-sm prose-p:leading-relaxed
       prose-li:text-xs prose-li:sm:text-sm prose-li:leading-relaxed
       prose-blockquote:text-xs prose-blockquote:sm:text-sm
       prose-td:text-xs prose-td:sm:text-sm prose-th:text-xs prose-th:sm:text-sm
       prose-figcaption:text-xs prose-img:max-w-xs prose-img:sm:max-w-sm prose-img:md:max-w-md
       ${className}`
    : `editor-content w-full max-w-none ${className}`;

  // Wrap in error boundary
  try {
    return (
      <div className={wrapperClasses}>
        <Output
          data={sanitizedData}
          style={fallbackStyles}
          classNames={styles}
          config={config}
          renderers={customRenderers}
        />
      </div>
    );
  } catch (error) {
    console.error('EditorJS Renderer Error:', error);
    return (
      <div className={`editor-content-error text-red-500 p-4 border border-red-200 rounded ${className}`}>
        <p className="font-medium">Error rendering content</p>
        <p className="text-sm mt-1">The content format appears to be invalid or corrupted.</p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs">Debug Info</summary>
            <pre className="text-xs mt-1 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </details>
        )}
      </div>
    );
  }
};

export default EditorJSRenderer;

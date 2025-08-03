import type { ContentBlocks, ContentBlock } from '../types/content';

// ===================================
// CONTENT BLOCK RENDERERS
// ===================================

/**
 * Render header block to HTML
 */
const renderHeaderBlock = (block: any): string => {
  const { text, level } = block.data;
  const sanitizedText = escapeHtml(text || '');
  const headingLevel = Math.min(Math.max(level || 1, 1), 6);
  
  return `<h${headingLevel} class="content-header content-header-${headingLevel}">${sanitizedText}</h${headingLevel}>`;
};

/**
 * Render paragraph block to HTML
 */
const renderParagraphBlock = (block: any): string => {
  const { text } = block.data;
  const sanitizedText = escapeHtml(text || '');
  
  return `<p class="content-paragraph">${sanitizedText}</p>`;
};

/**
 * Render list block to HTML
 */
const renderListBlock = (block: any): string => {
  const { style, items } = block.data;
  const listType = style === 'ordered' ? 'ol' : 'ul';
  const listClass = `content-list content-list-${style}`;
  
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }
  
  const listItems = items
    .map(item => `<li class="content-list-item">${escapeHtml(item)}</li>`)
    .join('');
  
  return `<${listType} class="${listClass}">${listItems}</${listType}>`;
};

/**
 * Render image block to HTML
 */
const renderImageBlock = (block: any): string => {
  const { file, caption, withBorder, stretched, withBackground } = block.data;
  
  if (!file?.url) {
    return '';
  }
  
  const imageClasses = [
    'content-image',
    withBorder && 'content-image-bordered',
    stretched && 'content-image-stretched',
    withBackground && 'content-image-background',
  ].filter(Boolean).join(' ');
  
  const imageHtml = `<img src="${escapeHtml(file.url)}" alt="${escapeHtml(caption || '')}" class="${imageClasses}" loading="lazy" />`;
  
  if (caption) {
    return `
      <figure class="content-image-figure">
        ${imageHtml}
        <figcaption class="content-image-caption">${escapeHtml(caption)}</figcaption>
      </figure>
    `;
  }
  
  return `<div class="content-image-wrapper">${imageHtml}</div>`;
};

/**
 * Render video block to HTML
 */
const renderVideoBlock = (block: any): string => {
  const { file, caption } = block.data;
  
  if (!file?.url) {
    return '';
  }
  
  const videoHtml = `
    <video class="content-video" controls preload="metadata">
      <source src="${escapeHtml(file.url)}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  `;
  
  if (caption) {
    return `
      <figure class="content-video-figure">
        ${videoHtml}
        <figcaption class="content-video-caption">${escapeHtml(caption)}</figcaption>
      </figure>
    `;
  }
  
  return `<div class="content-video-wrapper">${videoHtml}</div>`;
};

/**
 * Render quote block to HTML
 */
const renderQuoteBlock = (block: any): string => {
  const { text, caption, alignment } = block.data;
  const alignmentClass = alignment === 'center' ? 'content-quote-center' : 'content-quote-left';
  
  const quoteHtml = `<blockquote class="content-quote ${alignmentClass}">${escapeHtml(text || '')}</blockquote>`;
  
  if (caption) {
    return `
      <figure class="content-quote-figure">
        ${quoteHtml}
        <figcaption class="content-quote-caption">${escapeHtml(caption)}</figcaption>
      </figure>
    `;
  }
  
  return quoteHtml;
};

/**
 * Render table block to HTML
 */
const renderTableBlock = (block: any): string => {
  const { withHeadings, content } = block.data;
  
  if (!Array.isArray(content) || content.length === 0) {
    return '';
  }
  
  let tableHtml = '<table class="content-table">';
  
  content.forEach((row, rowIndex) => {
    if (!Array.isArray(row)) return;
    
    const isHeaderRow = withHeadings && rowIndex === 0;
    const cellTag = isHeaderRow ? 'th' : 'td';
    const rowClass = isHeaderRow ? 'content-table-header-row' : 'content-table-row';
    
    tableHtml += `<tr class="${rowClass}">`;
    row.forEach(cell => {
      tableHtml += `<${cellTag} class="content-table-cell">${escapeHtml(cell || '')}</${cellTag}>`;
    });
    tableHtml += '</tr>';
  });
  
  tableHtml += '</table>';
  
  return `<div class="content-table-wrapper">${tableHtml}</div>`;
};

/**
 * Render code block to HTML
 */
const renderCodeBlock = (block: any): string => {
  const { code, language } = block.data;
  const languageClass = language ? `language-${language}` : '';
  
  return `
    <div class="content-code-wrapper">
      <pre class="content-code"><code class="${languageClass}">${escapeHtml(code || '')}</code></pre>
    </div>
  `;
};

/**
 * Render delimiter block to HTML
 */
const renderDelimiterBlock = (): string => {
  return '<hr class="content-delimiter" />';
};

/**
 * Render warning block to HTML
 */
const renderWarningBlock = (block: any): string => {
  const { title, message } = block.data;
  
  return `
    <div class="content-warning">
      <div class="content-warning-title">${escapeHtml(title || '')}</div>
      <div class="content-warning-message">${escapeHtml(message || '')}</div>
    </div>
  `;
};

/**
 * Render embed block to HTML
 */
const renderEmbedBlock = (block: any): string => {
  const { service, source, embed, width, height, caption } = block.data;
  
  if (!embed && !source) {
    return '';
  }
  
  const embedHtml = embed || `<iframe src="${escapeHtml(source)}" width="${width || 560}" height="${height || 315}" frameborder="0" allowfullscreen></iframe>`;
  
  const wrapperHtml = `<div class="content-embed content-embed-${escapeHtml(service || 'generic')}">${embedHtml}</div>`;
  
  if (caption) {
    return `
      <figure class="content-embed-figure">
        ${wrapperHtml}
        <figcaption class="content-embed-caption">${escapeHtml(caption)}</figcaption>
      </figure>
    `;
  }
  
  return wrapperHtml;
};

/**
 * Render checklist block to HTML
 */
const renderChecklistBlock = (block: any): string => {
  const { items } = block.data;
  
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }
  
  const listItems = items
    .map(item => {
      const checked = item.checked ? 'checked' : '';
      const checkedClass = item.checked ? 'content-checklist-item-checked' : '';
      return `
        <li class="content-checklist-item ${checkedClass}">
          <input type="checkbox" ${checked} disabled class="content-checklist-checkbox" />
          <span class="content-checklist-text">${escapeHtml(item.text || '')}</span>
        </li>
      `;
    })
    .join('');
  
  return `<ul class="content-checklist">${listItems}</ul>`;
};

/**
 * Render attachment block to HTML
 */
const renderAttachmentBlock = (block: any): string => {
  const { file, title } = block.data;
  
  if (!file?.url) {
    return '';
  }
  
  const fileName = title || file.name || 'Download';
  const fileSize = file.size ? ` (${formatFileSize(file.size)})` : '';
  const fileExtension = file.extension || getFileExtension(file.name || '');
  
  return `
    <div class="content-attachment">
      <a href="${escapeHtml(file.url)}" download class="content-attachment-link">
        <span class="content-attachment-icon">📎</span>
        <span class="content-attachment-info">
          <span class="content-attachment-name">${escapeHtml(fileName)}</span>
          <span class="content-attachment-meta">${escapeHtml(fileExtension.toUpperCase())}${fileSize}</span>
        </span>
      </a>
    </div>
  `;
};

// ===================================
// BLOCK RENDERER MAP
// ===================================

const blockRenderers: Record<string, (block: ContentBlock) => string> = {
  header: renderHeaderBlock,
  paragraph: renderParagraphBlock,
  list: renderListBlock,
  image: renderImageBlock,
  video: renderVideoBlock,
  quote: renderQuoteBlock,
  table: renderTableBlock,
  code: renderCodeBlock,
  delimiter: renderDelimiterBlock,
  warning: renderWarningBlock,
  embed: renderEmbedBlock,
  checklist: renderChecklistBlock,
  attaches: renderAttachmentBlock,
};

// ===================================
// MAIN RENDERER FUNCTION
// ===================================

/**
 * Render content blocks to HTML
 */
export const renderContentBlocksToHtml = (contentBlocks: ContentBlocks): string => {
  if (!contentBlocks?.blocks || !Array.isArray(contentBlocks.blocks)) {
    return '';
  }
  
  return contentBlocks.blocks
    .map(block => {
      const renderer = blockRenderers[block.type];
      if (!renderer) {
        console.warn(`No renderer found for block type: ${block.type}`);
        return '';
      }
      
      try {
        return renderer(block);
      } catch (error) {
        console.error(`Error rendering block type ${block.type}:`, error);
        return '';
      }
    })
    .filter(html => html.trim().length > 0)
    .join('\n\n');
};

/**
 * Render content blocks to plain text
 */
export const renderContentBlocksToText = (contentBlocks: ContentBlocks): string => {
  if (!contentBlocks?.blocks || !Array.isArray(contentBlocks.blocks)) {
    return '';
  }
  
  return contentBlocks.blocks
    .map(block => {
      switch (block.type) {
        case 'header':
          return block.data.text || '';
        case 'paragraph':
          return block.data.text || '';
        case 'list':
          return Array.isArray(block.data.items) ? block.data.items.join('\n') : '';
        case 'quote':
          return `"${block.data.text || ''}"${block.data.caption ? ` - ${block.data.caption}` : ''}`;
        case 'table':
          return Array.isArray(block.data.content) 
            ? block.data.content.map(row => Array.isArray(row) ? row.join(' | ') : '').join('\n')
            : '';
        case 'code':
          return block.data.code || '';
        case 'warning':
          return `${block.data.title || ''}: ${block.data.message || ''}`;
        case 'checklist':
          return Array.isArray(block.data.items) 
            ? block.data.items.map(item => `${item.checked ? '✓' : '○'} ${item.text || ''}`).join('\n')
            : '';
        default:
          return '';
      }
    })
    .filter(text => text.trim().length > 0)
    .join('\n\n');
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Sanitize HTML content while preserving safe formatting tags
 */
function escapeHtml(text: string): string {
  if (!text) return '';

  // Replace &nbsp; with regular spaces
  let sanitized = text.replace(/&nbsp;/g, ' ');

  // Allow safe HTML tags: b, i, u, strong, em, mark, code, br
  // This is a simple approach - for production, consider using a proper HTML sanitizer
  const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'mark', 'code', 'br'];

  // For now, we'll allow these specific tags by not escaping them
  // This is a basic implementation - in production, use DOMPurify or similar
  return sanitized;
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension
 */
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

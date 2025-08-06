# EditorJS React Renderer

A complete and styled rendering system for Editor.js JSON data using `@editorjs/react-renderer` with Tailwind CSS support and dark mode compatibility.

## 🚀 Features

- **Complete Editor.js Support**: Renders all supported Editor.js blocks
- **Tailwind CSS Integration**: Full Tailwind prose styling with dark mode support
- **Custom Renderers**: Enhanced renderers for table, delimiter, and embed blocks
- **Responsive Design**: Mobile-first responsive layout
- **Accessibility**: WCAG compliant rendering
- **Fallback Support**: Clean CSS styles when Tailwind is not available
- **TypeScript**: Full TypeScript support with proper typing

## 📦 Supported Blocks

The renderer supports the following Editor.js tools:

- ✅ **Paragraph** - Text paragraphs with rich formatting
- ✅ **Header** - Headings (H1-H6) with proper hierarchy
- ✅ **List** - Ordered and unordered lists with nesting
- ✅ **Image** - Images with captions and styling options
- ✅ **Quote** - Blockquotes with author attribution
- ✅ **Delimiter** - Visual separators with custom styling
- ✅ **Embed** - External content (YouTube, Vimeo, Twitter, etc.)
- ✅ **Table** - Data tables with headers and responsive design

## 🛠️ Installation

The required package is already installed in the project:

```bash
npm install editorjs-react-renderer
```

## 📖 Usage

### Basic Usage

```tsx
import { EditorJSRenderer } from '../components/content';

const MyComponent = () => {
  const editorData = {
    version: "2.30.8",
    blocks: [
      {
        type: "header",
        data: {
          text: "Hello World",
          level: 2
        }
      },
      {
        type: "paragraph",
        data: {
          text: "This is a paragraph with <b>bold</b> text."
        }
      }
    ]
  };

  return (
    <EditorJSRenderer 
      data={editorData}
      useTailwindProse={true}
      darkMode={false}
    />
  );
};
```

### With Dark Mode

```tsx
<EditorJSRenderer 
  data={editorData}
  useTailwindProse={true}
  darkMode={true}
  className="my-custom-class"
/>
```

### Without Tailwind (Fallback CSS)

```tsx
<EditorJSRenderer 
  data={editorData}
  useTailwindProse={false}
  className="my-content"
/>
```

## 🎨 Styling

### Tailwind CSS Classes

When `useTailwindProse={true}`, the component uses Tailwind's prose classes:

```css
.prose .prose-lg .max-w-none
.prose-invert /* for dark mode */
```

### Custom CSS Classes

When `useTailwindProse={false}`, fallback CSS styles are applied:

```css
.editor-content {
  /* Custom CSS styles for all blocks */
}
```

### Dark Mode Support

Dark mode is supported through:
- Tailwind's `prose-invert` class
- Custom dark mode CSS variables
- Automatic color scheme detection

## 🔧 Custom Renderers

The component includes enhanced custom renderers for:

### Table Renderer
- Responsive table design
- Header row support
- Border styling
- Mobile-friendly overflow

### Delimiter Renderer
- Custom SVG separator
- Configurable styling
- Responsive spacing

### Embed Renderer
- YouTube video embedding
- Vimeo video embedding
- Twitter post embedding
- Generic iframe support
- Fallback link display

## 📱 Responsive Design

All rendered content is fully responsive:

- **Mobile**: Optimized for small screens
- **Tablet**: Balanced layout for medium screens
- **Desktop**: Full-width content with proper spacing

## ♿ Accessibility

The renderer ensures accessibility through:

- Proper heading hierarchy
- Alt text for images
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader compatibility

## 🔄 Migration from Old Renderer

The old `renderContentBlocksToHtml` function has been replaced. Update your code:

### Before
```tsx
import { renderContentBlocksToHtml } from '../../utils/contentRenderer';

const html = renderContentBlocksToHtml(contentBlocks);
return <div dangerouslySetInnerHTML={{ __html: html }} />;
```

### After
```tsx
import { EditorJSRenderer } from '../../components/content';

return <EditorJSRenderer data={contentBlocks} useTailwindProse={true} />;
```

## 🎯 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ContentBlocks` | Required | Editor.js JSON data |
| `className` | `string` | `''` | Additional CSS classes |
| `useTailwindProse` | `boolean` | `true` | Use Tailwind prose styling |
| `darkMode` | `boolean` | `false` | Enable dark mode styling |

## 🔍 Error Handling

The component includes comprehensive error handling:

- Invalid data structure detection
- Graceful fallbacks for unsupported blocks
- Console warnings for debugging
- User-friendly error messages

## 🧪 Testing

Test your rendered content:

```tsx
import { render } from '@testing-library/react';
import { EditorJSRenderer } from '../components/content';

test('renders editor content', () => {
  const data = {
    blocks: [
      { type: 'paragraph', data: { text: 'Test content' } }
    ]
  };
  
  render(<EditorJSRenderer data={data} />);
  // Add your assertions
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Content not rendering**: Check data structure matches Editor.js format
2. **Styling issues**: Ensure Tailwind CSS is properly configured
3. **Dark mode not working**: Verify dark mode classes are available

### Debug Mode

Enable debug logging:

```tsx
<EditorJSRenderer 
  data={editorData}
  // Add debug logging in development
/>
```

## 📚 Examples

See the component in action:
- `Frontend/src/components/posts/PostContent.tsx`
- `Frontend/src/pages/admin/ContentManagement.tsx`

## 🤝 Contributing

When adding new block types:

1. Add the block type to `CONTENT_BLOCK_TYPES`
2. Create a custom renderer if needed
3. Add TypeScript interfaces
4. Update this documentation

## 📄 License

This component is part of the GIV Society project.

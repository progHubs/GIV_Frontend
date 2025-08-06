/**
 * EditorJS Renderer Demo Component
 * Demonstrates all supported Editor.js blocks with the new renderer
 */

import React, { useState } from 'react';
import EditorJSRenderer from './EditorJSRenderer';
import type { ContentBlocks } from '../../types/content';

// ===================================
// DEMO DATA
// ===================================

const demoData: ContentBlocks = {
  version: "2.30.8",
  blocks: [
    {
      id: "demo-header-1",
      type: "header",
      data: {
        text: "EditorJS React Renderer Demo",
        level: 1
      }
    },
    {
      id: "demo-paragraph-1",
      type: "paragraph",
      data: {
        text: "This demo showcases all supported Editor.js blocks rendered with the new <b>@editorjs/react-renderer</b> system. The renderer supports Tailwind CSS prose styling with dark mode compatibility."
      }
    },
    {
      id: "demo-header-2",
      type: "header",
      data: {
        text: "Supported Block Types",
        level: 2
      }
    },
    {
      id: "demo-list-1",
      type: "list",
      data: {
        style: "unordered",
        items: [
          "Paragraph blocks with rich text formatting",
          "Headers (H1-H6) with proper hierarchy",
          "Ordered and unordered lists",
          "Images with captions and styling",
          "Blockquotes with author attribution",
          "Tables with responsive design",
          "Visual delimiters",
          "External embeds (YouTube, Vimeo, etc.)"
        ]
      }
    },
    {
      id: "demo-quote-1",
      type: "quote",
      data: {
        text: "The new renderer provides a clean, accessible, and responsive way to display Editor.js content with full Tailwind CSS integration.",
        caption: "EditorJS React Renderer",
        alignment: "left"
      }
    },
    {
      id: "demo-delimiter-1",
      type: "delimiter",
      data: {}
    },
    {
      id: "demo-header-3",
      type: "header",
      data: {
        text: "Table Example",
        level: 3
      }
    },
    {
      id: "demo-table-1",
      type: "table",
      data: {
        withHeadings: true,
        content: [
          ["Feature", "Old Renderer", "New Renderer"],
          ["Tailwind Support", "❌", "✅"],
          ["Dark Mode", "❌", "✅"],
          ["Custom Renderers", "❌", "✅"],
          ["Accessibility", "⚠️", "✅"],
          ["Responsive Design", "⚠️", "✅"],
          ["TypeScript", "⚠️", "✅"]
        ]
      }
    },
    {
      id: "demo-header-4",
      type: "header",
      data: {
        text: "Image Example",
        level: 3
      }
    },
    {
      id: "demo-image-1",
      type: "image",
      data: {
        file: {
          url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
        },
        caption: "Beautiful landscape rendered with the new image renderer",
        withBorder: false,
        stretched: false,
        withBackground: false
      }
    },
    {
      id: "demo-header-5",
      type: "header",
      data: {
        text: "Embed Example",
        level: 3
      }
    },
    {
      id: "demo-embed-1",
      type: "embed",
      data: {
        service: "youtube",
        source: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embed: "",
        width: 580,
        height: 320,
        caption: "YouTube video embedded with custom renderer"
      }
    },
    {
      id: "demo-paragraph-2",
      type: "paragraph",
      data: {
        text: "This concludes the demo of all supported Editor.js blocks. The renderer handles each block type with appropriate styling and responsive behavior."
      }
    }
  ]
};

// ===================================
// DEMO COMPONENT
// ===================================

const EditorJSRendererDemo: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [useTailwind, setUseTailwind] = useState(true);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Controls */}
        <div className={`mb-8 p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Renderer Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="rounded"
              />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Dark Mode
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useTailwind}
                onChange={(e) => setUseTailwind(e.target.checked)}
                className="rounded"
              />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Use Tailwind Prose
              </span>
            </label>
          </div>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Toggle these options to see how the renderer adapts to different configurations.
          </p>
        </div>

        {/* Rendered Content */}
        <div className={`rounded-lg border p-6 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <EditorJSRenderer
            data={demoData}
            useTailwindProse={useTailwind}
            darkMode={darkMode}
            className="demo-content"
          />
        </div>

        {/* Info Panel */}
        <div className={`mt-8 p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
          <h3 className={`text-md font-semibold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>
            Implementation Details
          </h3>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
            <li>• Using <code>@editorjs/react-renderer</code> for block rendering</li>
            <li>• Custom renderers for table, delimiter, and embed blocks</li>
            <li>• Tailwind CSS prose classes with dark mode support</li>
            <li>• Fallback CSS styles when Tailwind is disabled</li>
            <li>• Fully responsive and accessible design</li>
            <li>• TypeScript support with proper type definitions</li>
          </ul>
        </div>

        {/* Code Example */}
        <div className={`mt-8 p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`text-md font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Usage Example
          </h3>
          <pre className={`text-sm overflow-x-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <code>{`<EditorJSRenderer
  data={editorData}
  useTailwindProse={${useTailwind}}
  darkMode={${darkMode}}
  className="my-content"
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EditorJSRendererDemo;

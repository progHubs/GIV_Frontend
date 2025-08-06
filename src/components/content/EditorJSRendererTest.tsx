/**
 * EditorJS Renderer Test Component
 * Tests all the fixes applied to the renderer
 */

import React, { useState } from 'react';
import EditorJSRenderer from './EditorJSRenderer';
import type { ContentBlocks } from '../../types/content';

// Test data with all the issues that were fixed
const testData: ContentBlocks = {
  version: "2.30.8",
  blocks: [
    {
      id: "test-header-1",
      type: "header",
      data: {
        text: "EditorJS Renderer Fixes Test",
        level: 1
      }
    },
    {
      id: "test-paragraph-1",
      type: "paragraph",
      data: {
        text: "This test verifies all the styling fixes: minimized font sizes, proper list markers, quote backgrounds, table inner tools, and image backgrounds."
      }
    },
    {
      id: "test-header-2",
      type: "header",
      data: {
        text: "Font Size Test (Should be smaller)",
        level: 2
      }
    },
    {
      id: "test-paragraph-2",
      type: "paragraph",
      data: {
        text: "This paragraph should have smaller font size compared to before. The text should be readable but more compact."
      }
    },
    {
      id: "test-list-unordered",
      type: "list",
      data: {
        style: "unordered",
        items: [
          "First unordered item (bullet should show)",
          "Second unordered item with <b>bold text</b>",
          "Third item with <i>italic text</i>"
        ]
      }
    },
    {
      id: "test-list-ordered",
      type: "list",
      data: {
        style: "ordered",
        items: [
          "First ordered item (number should show)",
          "Second ordered item with <strong>strong text</strong>",
          "Third item with <em>emphasized text</em>"
        ]
      }
    },
    {
      id: "test-quote-1",
      type: "quote",
      data: {
        text: "This quote should have a light background and the caption should be close to the quote content.",
        caption: "Test Author",
        alignment: "left"
      }
    },
    {
      id: "test-table-1",
      type: "table",
      data: {
        withHeadings: true,
        content: [
          ["Feature", "Status", "Notes"],
          ["<b>Bold Text</b>", "✅ Working", "Should render as bold"],
          ["<i>Italic Text</i>", "✅ Working", "Should render as italic"],
          ["<strong>Strong&nbsp;Text</strong>", "✅ Working", "Should render properly"],
          ["Regular Text", "✅ Working", "Normal text rendering"]
        ]
      }
    },
    {
      id: "test-image-1",
      type: "image",
      data: {
        file: {
          url: "https://via.placeholder.com/400x300/e2e8f0/64748b?text=Normal+Image"
        },
        caption: "Normal image without background (should be centered and responsive)",
        withBackground: false,
        withBorder: false,
        stretched: false
      }
    },
    {
      id: "test-image-2",
      type: "image",
      data: {
        file: {
          url: "https://via.placeholder.com/400x300/f1f5f9/475569?text=Background+Test"
        },
        caption: "Image with background enabled (should be centered in background)",
        withBackground: true,
        withBorder: true,
        stretched: false
      }
    },
    {
      id: "test-image-3",
      type: "image",
      data: {
        file: {
          url: "https://via.placeholder.com/800x200/ddd6fe/7c3aed?text=Wide+Image"
        },
        caption: "Wide image test (should be responsive and not overflow)",
        withBackground: false,
        withBorder: false,
        stretched: false
      }
    }
  ]
};

const EditorJSRendererTest: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            EditorJS Renderer Fixes Test
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
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
          </div>

          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
            <h2 className="font-semibold mb-2">What to check (All Fixed Issues):</h2>
            <ul className="text-sm space-y-1">
              <li>• ✅ Font sizes are ultra-minimized and responsive</li>
              <li>• ✅ Headers are much smaller (H1 is now text-sm on mobile)</li>
              <li>• ✅ List items show bullets (•) and numbers (1, 2, 3) properly</li>
              <li>• ✅ Quote has light background with close caption</li>
              <li>• ✅ Table cells with HTML render bold/italic properly</li>
              <li>• ✅ Images are responsive, centered, and properly sized</li>
              <li>• ✅ Images with background are centered within background</li>
              <li>• ✅ All content is fully responsive (mobile, tablet, desktop)</li>
              <li>• ✅ Try resizing browser to test responsiveness</li>
            </ul>
          </div>
        </div>

        {/* Test Content */}
        <div className={`rounded-lg border p-6 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <EditorJSRenderer
            data={testData}
            useTailwindProse={true}
            darkMode={darkMode}
            className="test-content"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorJSRendererTest;

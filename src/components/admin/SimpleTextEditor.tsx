/**
 * Simple Text Editor Component
 * A fallback editor for content creation when EditorJS has issues
 */

import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { type OutputData } from '@editorjs/editorjs';

interface SimpleTextEditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export interface SimpleTextEditorRef {
  save: () => Promise<OutputData>;
  clear: () => void;
  destroy: () => void;
}

const SimpleTextEditor = forwardRef<SimpleTextEditorRef, SimpleTextEditorProps>(({
  data,
  onChange,
  placeholder = 'Start writing your content...',
  readOnly = false,
  className = ''
}, ref) => {
  const [content, setContent] = useState<string>('');

  useImperativeHandle(ref, () => ({
    save: async () => {
      const outputData: OutputData = {
        time: Date.now(),
        blocks: [
          {
            id: 'content-block',
            type: 'paragraph',
            data: {
              text: content
            }
          }
        ],
        version: '2.28.2'
      };
      return outputData;
    },
    clear: () => {
      setContent('');
    },
    destroy: () => {
      // Nothing to destroy for simple textarea
    }
  }));

  // Convert EditorJS data to plain text
  useEffect(() => {
    if (data && data.blocks) {
      const textContent = data.blocks
        .map(block => {
          if (block.type === 'paragraph' && block.data?.text) {
            return block.data.text;
          }
          if (block.type === 'header' && block.data?.text) {
            return `# ${block.data.text}`;
          }
          if (block.type === 'list' && block.data?.items) {
            return block.data.items.map((item: string) => `- ${item}`).join('\n');
          }
          return '';
        })
        .filter(text => text.length > 0)
        .join('\n\n');
      
      setContent(textContent);
    }
  }, [data]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    setContent(newContent);

    if (onChange) {
      const outputData: OutputData = {
        time: Date.now(),
        blocks: [
          {
            id: 'content-block',
            type: 'paragraph',
            data: {
              text: newContent
            }
          }
        ],
        version: '2.28.2'
      };
      onChange(outputData);
    }
  };

  return (
    <div className={`simple-text-editor ${className}`}>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>📝</span>
            <span>Simple Text Editor</span>
            <span className="text-xs text-gray-400">
              (EditorJS will be available once configuration is complete)
            </span>
          </div>
        </div>

        {/* Editor Area */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className="w-full min-h-[400px] resize-none border-none outline-none text-gray-900 placeholder-gray-500"
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-300 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{content.length} characters</span>
            <span>
              Supports: Plain text, basic formatting with markdown-style syntax
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .simple-text-editor textarea:focus {
          outline: none;
        }
        .simple-text-editor .border-gray-300:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
});

SimpleTextEditor.displayName = 'SimpleTextEditor';

export default SimpleTextEditor;

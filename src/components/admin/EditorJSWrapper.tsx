/**
 * EditorJS Wrapper Component
 * Reusable EditorJS component for content creation and editing
 */

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import EditorJS, { type OutputData } from '@editorjs/editorjs';
interface EditorJSWrapperProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export interface EditorJSWrapperRef {
  save: () => Promise<OutputData>;
  clear: () => void;
  destroy: () => void;
}

const EditorJSWrapper = forwardRef<EditorJSWrapperRef, EditorJSWrapperProps>(({
  data,
  onChange,
  placeholder = 'Start writing your content...',
  readOnly = false,
  className = ''
}, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorRef.current && typeof editorRef.current.save === 'function') {
        try {
          return await editorRef.current.save();
        } catch (error) {
          console.error('Error saving editor data:', error);
          return { blocks: [] };
        }
      }
      return { blocks: [] };
    },
    clear: () => {
      if (editorRef.current && typeof editorRef.current.clear === 'function') {
        try {
          editorRef.current.clear();
        } catch (error) {
          console.error('Error clearing editor:', error);
        }
      }
    },
    destroy: () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error('Error destroying editor:', error);
          editorRef.current = null;
        }
      }
    }
  }));

  useEffect(() => {
    if (!holderRef.current) return;

    let editor: EditorJS | null = null;

    const initializeEditor = async () => {
      try {
        editor = new EditorJS({
          holder: holderRef.current!,
          data: data || { blocks: [] },
          readOnly,
          placeholder,
          // Using minimal tools to avoid type issues
          tools: {},
          onChange: async () => {
            if (onChange && editor) {
              try {
                const outputData = await editor.save();
                onChange(outputData);
              } catch (error) {
                console.error('Error saving editor data:', error);
              }
            }
          },
          onReady: () => {
            console.log('EditorJS is ready to work!');
          }
        });

        editorRef.current = editor;
      } catch (error) {
        console.error('Error initializing EditorJS:', error);
      }
    };

    initializeEditor();

    return () => {
      if (editor && typeof editor.destroy === 'function') {
        try {
          editor.destroy();
        } catch (error) {
          console.error('Error destroying editor in cleanup:', error);
        }
      }
      editorRef.current = null;
    };
  }, []);

  // Update editor data when prop changes
  useEffect(() => {
    if (editorRef.current && data && typeof editorRef.current.render === 'function') {
      try {
        editorRef.current.render(data);
      } catch (error) {
        console.error('Error rendering editor data:', error);
      }
    }
  }, [data]);

  return (
    <div className={`editor-js-wrapper ${className}`}>
      <div 
        ref={holderRef}
        className="min-h-[400px] prose prose-lg max-w-none focus:outline-none"
        style={{
          fontSize: '16px',
          lineHeight: '1.6'
        }}
      />
      <style>{`
        .editor-js-wrapper .codex-editor {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
        }
        .editor-js-wrapper .codex-editor__redactor {
          padding-bottom: 100px !important;
        }
        .editor-js-wrapper .ce-block__content {
          max-width: none;
        }
        .editor-js-wrapper .ce-toolbar__content {
          max-width: none;
        }
        .editor-js-wrapper .ce-block--focused {
          background: #f9fafb;
        }
        .editor-js-wrapper .ce-paragraph {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
});

EditorJSWrapper.displayName = 'EditorJSWrapper';

export default EditorJSWrapper;

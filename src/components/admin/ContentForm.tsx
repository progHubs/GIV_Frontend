/**
 * Content Form Component
 * Simple form for creating and editing posts with EditorJS
 */

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import Checklist from '@editorjs/checklist';
import Warning from '@editorjs/warning';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Code from '@editorjs/code';
import Link from '@editorjs/link';
import Image from '@editorjs/image';
import Attaches from '@editorjs/attaches';
import { useCreatePost, useUpdatePost, useUploadFile } from '../../hooks/useContent';
import * as contentApi from '../../lib/contentApi';
import type { Post, PostCreateData, ContentBlocks } from '../../types/content';
import { type OutputData } from '@editorjs/editorjs';

interface ContentFormProps {
  post?: Post;
  onSave: (post: Post) => void;
  onCancel: () => void;
  onPreview?: (post: Post) => void;
}

interface FormData {
  title: string;
  slug: string;
  post_type: 'blog' | 'news' | 'press_release';
  language: 'en' | 'am';
  tags: string;
  is_featured: boolean;
  feature_image?: string;
  video_url?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({
  post,
  onSave,
  onCancel,
  onPreview
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featureImageFile, setFeatureImageFile] = useState<File | null>(null);
  const [featureImagePreview, setFeatureImagePreview] = useState<string | undefined>(
    post?.feature_image
  );
  
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const uploadMutation = useUploadFile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      post_type: post?.post_type || 'blog',
      language: post?.language || 'en',
      tags: post?.tags || '',
      is_featured: post?.is_featured || false,
      feature_image: post?.feature_image || '',
      video_url: post?.video_url || ''
    }
  });

  const watchedTitle = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !post) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, setValue, post]);

  // Initialize EditorJS
  useEffect(() => {
    if (editorContainerRef.current && !editorRef.current) {
      try {
        editorRef.current = new EditorJS({
          holder: editorContainerRef.current,
          placeholder: 'Start writing your content...',
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
              },
            },
            marker: {
              class: Marker,
              shortcut: 'CMD+SHIFT+M',
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
            delimiter: Delimiter,
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  coub: true,
                  vimeo: true,
                  vine: true,
                  imgur: true,
                  gfycat: true,
                  instagram: true,
                  twitter: true,
                  facebook: true,
                  codepen: true,
                  jsfiddle: true,
                  jsbin: true,
                  plunker: true,
                  codesandbox: true,
                  github: true,
                  gitlab: true,
                  bitbucket: true,
                  pastebin: true,
                  jsitor: true,
                },
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
              },
            },
            code: Code,
            image: {
              class: Image,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    try {
                      const response = await contentApi.uploadFile(file);
                      return {
                        success: 1,
                        file: {
                          url: response.data.url,
                        },
                      };
                    } catch (error) {
                      console.error('Upload error:', error);
                      return {
                        success: 0,
                        error: 'Upload failed',
                      };
                    }
                  },
                },
              },
            },
            attaches: {
              class: Attaches,
              config: {
                endpoint: '/api/upload',
              },
            },
          },
          data: post?.content_blocks ? {
            blocks: post.content_blocks.blocks,
            version: post.content_blocks.version,
          } : {
            blocks: [],
            version: '2.30.8',
          },
        });
      } catch (error) {
        console.error('Error initializing EditorJS:', error);
        editorRef.current = null;
      }
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
        editorRef.current = null;
      }
    };
  }, [post]);

  const handleFeatureImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFeatureImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeatureImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFeatureImage = () => {
    setFeatureImageFile(null);
    setFeatureImagePreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Get content from EditorJS
      let contentBlocks: ContentBlocks | undefined;
      if (editorRef.current && typeof editorRef.current.save === 'function') {
        try {
          const editorData = await editorRef.current.save();
          contentBlocks = {
            version: editorData.version || '2.30.8',
            blocks: editorData.blocks as any,
          };
          
          // Console log the content blocks structure
          console.log('=== EDITORJS CONTENT BLOCKS STRUCTURE ===');
          console.log('Full EditorJS Data:', editorData);
          console.log('Content Blocks:', contentBlocks);
          console.log('Blocks Array:', editorData.blocks);
          console.log('Version:', editorData.version);

          // Debug list blocks specifically
          editorData.blocks.forEach((block, index) => {
            if (block.type === 'list') {
              console.log(`=== LIST BLOCK ${index} DEBUG ===`);
              console.log('Block ID:', block.id);
              console.log('Block Type:', block.type);
              console.log('Block Data:', block.data);
              console.log('Items Array:', block.data.items);
              console.log('Items Type:', Array.isArray(block.data.items) ? 'array' : typeof block.data.items);
              if (Array.isArray(block.data.items)) {
                block.data.items.forEach((item, itemIndex) => {
                  console.log(`Item ${itemIndex}:`, item);
                  console.log(`Item ${itemIndex} type:`, typeof item);
                  if (typeof item === 'object' && item !== null) {
                    console.log(`Item ${itemIndex} content:`, item.content);
                    console.log(`Item ${itemIndex} keys:`, Object.keys(item));
                  }
                });
              }
              console.log('================================');
            }
          });

          console.log('==========================================');
        } catch (error) {
          console.error('Error saving editor data:', error);
        }
      }

      // Handle file upload if there's a new feature image
      let uploadedImageUrl = data.feature_image;
      if (featureImageFile) {
        const uploadResult = await uploadMutation.mutateAsync({ file: featureImageFile });
        uploadedImageUrl = uploadResult.data.url;
      }

      const postData: PostCreateData = {
        title: data.title,
        slug: data.slug,
        post_type: data.post_type,
        language: data.language,
        tags: data.tags,
        is_featured: data.is_featured,
        feature_image: uploadedImageUrl,
        video_url: data.video_url,
        content_blocks: contentBlocks
      };

      // Console log the final post data
      console.log('=== FINAL POST DATA ===');
      console.log('Post Data:', postData);
      console.log('Content Blocks in Post Data:', postData.content_blocks);
      console.log('========================');

      if (post) {
        // Update existing post
        const result = await updatePostMutation.mutateAsync({
          id: post.id,
          postData,
          files: featureImageFile ? { feature_image: featureImageFile } : undefined
        });
        onSave(result.data);
      } else {
        // Create new post
        const result = await createPostMutation.mutateAsync({
          postData,
          files: featureImageFile ? { feature_image: featureImageFile } : undefined
        });
        onSave(result.data);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = async () => {
    try {
      let contentBlocks: ContentBlocks | undefined;
      if (editorRef.current && typeof editorRef.current.save === 'function') {
        try {
          const editorData = await editorRef.current.save();
          contentBlocks = {
            version: editorData.version || '2.30.8',
            blocks: editorData.blocks as any,
          };
        } catch (error) {
          console.error('Error saving editor data for preview:', error);
        }
      }

      const previewPost: Post = {
        id: post?.id || 'preview',
        title: watch('title') || 'Preview',
        slug: watch('slug') || 'preview',
        content: '',
        content_blocks: contentBlocks,
        post_type: watch('post_type') || 'blog',
        language: watch('language') || 'en',
        tags: watch('tags') || '',
        is_featured: watch('is_featured') || false,
        feature_image: featureImagePreview,
        video_url: watch('video_url') || '',
        views: 0,
        likes: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onPreview?.(previewPost);
    } catch (error) {
      console.error('Error creating preview:', error);
      toast.error('Failed to create preview');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {post ? 'Edit Content' : 'Create New Content'}
          </h2>
          <div className="flex items-center space-x-3">
            {onPreview && (
              <button
                type="button"
                onClick={handlePreview}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Preview</span>
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title and Slug Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                {...register('slug', { required: 'Slug is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="post-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <select
                {...register('post_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="blog">Blog Post</option>
                <option value="news">News Article</option>
                <option value="press_release">Press Release</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                {...register('language')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="am">Amharic</option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  {...register('is_featured')}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Post</span>
              </label>
            </div>
          </div>

          {/* Media and Tags Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feature Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feature Image
              </label>
              {featureImagePreview ? (
                <div className="relative">
                  <img
                    src={featureImagePreview}
                    alt="Feature"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeFeatureImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">Click to upload image</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeatureImageChange}
                className="hidden"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (Optional)
              </label>
              <input
                {...register('video_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                {...register('tags')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="health, medical, community"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Content Editor - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div
              ref={editorContainerRef}
              className="border border-gray-300 rounded-lg min-h-[500px] p-4"
            />
            <style dangerouslySetInnerHTML={{
              __html: `
                .ce-block__content {
                  max-width: none !important;
                  margin: 0 32px !important;
                  padding: 0 32px !important;
                }
                .ce-toolbar__content {
                  max-width: none !important;
                  margin: 0 32px !important;
                  padding: 0 32px !important;
                }
                .ce-block {
                  margin-bottom: 10px !important;
                }
                .ce-block:last-child {
                  margin-bottom: 0 !important;
                }
                .ce-paragraph {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 0 0 !important;
                  line-height: 1.6 !important;
                }
                .ce-header {
                  text-align: left !important;
                  margin: 0 0 16px !important;
                  padding: 16px 0 8px 0 !important;
                  line-height: 1.3 !important;
                }
                .ce-quote {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 16px 0 !important;
                  border-left: 4px solid #e5e7eb !important;
                  padding-left: 16px !important;
                }
                .ce-list {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 12px 0 !important;
                  line-height: 1.5 !important;
                }
                .ce-list__item {
                  margin-bottom: 8px !important;
                }
                .ce-list__item:last-child {
                  margin-bottom: 0 !important;
                }
                .ce-code {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 16px 0 !important;
                  background-color: #f9fafb !important;
                  border-radius: 6px !important;
                  padding: 12px 16px !important;
                }
                .ce-delimiter {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 24px 0 !important;
                }
                .ce-delimiter::before {
                  content: "***" !important;
                  display: block !important;
                  text-align: center !important;
                  color: #9ca3af !important;
                  font-size: 18px !important;
                }
                .ce-table {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 20px 0 !important;
                }
                .ce-table__cell {
                  padding: 8px 12px !important;
                  border: 1px solid #e5e7eb !important;
                }
                .ce-embed {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 24px 0 !important;
                }
                .ce-image {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 20px 0 !important;
                }
                .ce-image__caption {
                  margin-top: 8px !important;
                  font-size: 14px !important;
                  color: #6b7280 !important;
                  text-align: center !important;
                }
                .ce-attaches {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 16px 0 !important;
                  background-color: #f9fafb !important;
                  border-radius: 6px !important;
                  padding: 12px 16px !important;
                }
                .ce-checklist {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 12px 0 !important;
                }
                .ce-checklist__item {
                  margin-bottom: 8px !important;
                  padding: 4px 0 !important;
                }
                .ce-checklist__item:last-child {
                  margin-bottom: 0 !important;
                }
                .ce-marker {
                  text-align: left !important;
                  margin: 0 !important;
                  padding: 8px 0 !important;
                  background-color: #fef3c7 !important;
                  padding: 2px 4px !important;
                  border-radius: 3px !important;
                }
                .ce-toolbar__plus {
                  margin-left: 8px !important;
                }
                .ce-toolbar__settings {
                  margin-right: 8px !important;
                }
              `
            }} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;

// Upload API Integration
// Handles file uploads to backend endpoints

import { api } from './api';
import type { ApiResponse } from '../types/api';

// Upload response interface
export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    publicId: string;
    originalName: string;
    fileSize: number;
    width?: number;
    height?: number;
    format?: string;
    resourceType?: string;
  };
  error?: string;
  message?: string;
}

// Upload options interface
export interface UploadOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

// File validation utilities
export const validateFile = {
  image: (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      return 'Image file size must be less than 5MB';
    }
    return null;
  },

  video: (file: File): string | null => {
    const validTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv'];
    if (!validTypes.includes(file.type)) {
      return 'Please select a valid video file (MP4, WebM, AVI, MOV, WMV)';
    }
    if (file.size > 50 * 1024 * 1024) {
      // 50MB
      return 'Video file size must be less than 50MB';
    }
    return null;
  },

  document: (file: File): string | null => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    if (!validTypes.includes(file.type)) {
      return 'Please select a valid document file (PDF, DOC, DOCX, XLS, XLSX, TXT)';
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return 'Document file size must be less than 10MB';
    }
    return null;
  },
};

// Upload API functions
export const uploadApi = {
  // Note: Campaign files are uploaded directly with campaign data
  // These functions are for standalone uploads if needed

  // Upload to posts endpoint (generic file upload)
  uploadToPostsEndpoint: async (file: File, options?: UploadOptions): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.upload<UploadResponse>('/posts/upload-file', formData, {
        signal: options?.signal,
        onUploadProgress: options?.onProgress
          ? progressEvent => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              options.onProgress!(progress);
            }
          : undefined,
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload file',
      };
    }
  },

  // Upload volunteer documents
  uploadVolunteerDocuments: async (
    files: File[],
    options?: UploadOptions
  ): Promise<UploadResponse[]> => {
    const results: UploadResponse[] = [];

    for (const file of files) {
      const validationError = validateFile.document(file);
      if (validationError) {
        results.push({
          success: false,
          error: validationError,
        });
        continue;
      }

      const formData = new FormData();
      formData.append('documents', file);

      try {
        const response = await api.upload<UploadResponse>(
          '/volunteers/upload-documents',
          formData,
          {
            signal: options?.signal,
            onUploadProgress: options?.onProgress
              ? progressEvent => {
                  const progress = progressEvent.total
                    ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    : 0;
                  options.onProgress!(progress);
                }
              : undefined,
          }
        );

        results.push(response);
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message || 'Failed to upload document',
        });
      }
    }

    return results;
  },

  // Generic file upload
  uploadFile: async (
    file: File,
    endpoint: string,
    fieldName: string = 'file',
    options?: UploadOptions
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await api.upload<UploadResponse>(endpoint, formData, {
        signal: options?.signal,
        onUploadProgress: options?.onProgress
          ? progressEvent => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              options.onProgress!(progress);
            }
          : undefined,
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload file',
      };
    }
  },
};

// File utility functions
export const fileUtils = {
  // Get file extension
  getFileExtension: (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Check if file is image
  isImage: (file: File): boolean => {
    return file.type.startsWith('image/');
  },

  // Check if file is video
  isVideo: (file: File): boolean => {
    return file.type.startsWith('video/');
  },

  // Create preview URL for file
  createPreviewUrl: (file: File): string => {
    return URL.createObjectURL(file);
  },

  // Revoke preview URL
  revokePreviewUrl: (url: string): void => {
    URL.revokeObjectURL(url);
  },
};

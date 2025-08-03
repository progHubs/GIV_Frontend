import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useUploadFile, useUploadConfig } from './useContent';
import type { UploadedFile } from '../types/content';
import { 
  SUPPORTED_IMAGE_TYPES, 
  SUPPORTED_VIDEO_TYPES, 
  SUPPORTED_DOCUMENT_TYPES,
  FILE_SIZE_LIMITS,
  ERROR_MESSAGES 
} from '../constants/content';
import { formatFileSize, isValidFileType, generateUniqueFilename } from '../utils/contentUtils';

// ===================================
// TYPES
// ===================================

interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error?: string;
  uploadedFiles: UploadedFile[];
}

interface FileUploadOptions {
  maxFiles?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  autoUpload?: boolean;
  generateUniqueName?: boolean;
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (progress: number, file: File) => void;
  onUploadComplete?: (uploadedFile: UploadedFile, file: File) => void;
  onUploadError?: (error: string, file: File) => void;
  onAllUploadsComplete?: (uploadedFiles: UploadedFile[]) => void;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// ===================================
// HOOK
// ===================================

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const {
    maxFiles = 10,
    maxFileSize,
    allowedTypes,
    autoUpload = true,
    generateUniqueName = true,
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    onAllUploadsComplete,
  } = options;

  // State
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: undefined,
    uploadedFiles: [],
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadQueueRef = useRef<File[]>([]);
  const currentUploadRef = useRef<AbortController | null>(null);

  // Hooks
  const uploadFileMutation = useUploadFile();
  const { data: uploadConfig } = useUploadConfig();

  // Get effective configuration
  const getEffectiveConfig = useCallback(() => {
    const config = uploadConfig?.data || {};
    return {
      maxFileSize: maxFileSize || FILE_SIZE_LIMITS.IMAGE,
      allowedTypes: allowedTypes || [
        ...SUPPORTED_IMAGE_TYPES,
        ...SUPPORTED_VIDEO_TYPES,
        ...SUPPORTED_DOCUMENT_TYPES,
      ],
      maxFiles: Math.min(maxFiles, config.maxFiles?.total || 10),
    };
  }, [maxFileSize, allowedTypes, maxFiles, uploadConfig]);

  // Validate file
  const validateFile = useCallback((file: File): FileValidationResult => {
    const config = getEffectiveConfig();

    // Check file size
    if (file.size > config.maxFileSize) {
      return {
        isValid: false,
        error: `File "${file.name}" is too large. Maximum size is ${formatFileSize(config.maxFileSize)}.`,
      };
    }

    // Check file type
    if (!isValidFileType(file, config.allowedTypes)) {
      return {
        isValid: false,
        error: `File type "${file.type}" is not supported for "${file.name}".`,
      };
    }

    // Check total files limit
    if (state.uploadedFiles.length >= config.maxFiles) {
      return {
        isValid: false,
        error: `Maximum number of files (${config.maxFiles}) reached.`,
      };
    }

    return { isValid: true };
  }, [getEffectiveConfig, state.uploadedFiles.length]);

  // Upload single file
  const uploadSingleFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    try {
      onUploadStart?.(file);

      // Create abort controller for this upload
      const abortController = new AbortController();
      currentUploadRef.current = abortController;

      // Prepare file for upload
      const fileToUpload = generateUniqueName 
        ? new File([file], generateUniqueFilename(file.name), { type: file.type })
        : file;

      // Upload configuration
      const uploadConfigOptions = {
        generateThumbnails: true,
        optimizeImages: true,
        preserveOriginalName: !generateUniqueName,
      };

      // Perform upload
      const result = await uploadFileMutation.mutateAsync({
        file: fileToUpload,
        config: uploadConfigOptions,
      });

      if (result.success && result.data) {
        const uploadedFile: UploadedFile = {
          ...result.data,
          tempId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        onUploadComplete?.(uploadedFile, file);
        return uploadedFile;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return null; // Upload was cancelled
      }
      
      const errorMessage = error.message || ERROR_MESSAGES.UPLOAD_FAILED;
      onUploadError?.(errorMessage, file);
      throw error;
    } finally {
      currentUploadRef.current = null;
    }
  }, [uploadFileMutation, generateUniqueName, onUploadStart, onUploadComplete, onUploadError]);

  // Process upload queue
  const processUploadQueue = useCallback(async () => {
    if (uploadQueueRef.current.length === 0) return;

    setState(prev => ({ ...prev, isUploading: true, error: undefined }));

    const filesToUpload = [...uploadQueueRef.current];
    uploadQueueRef.current = [];

    const uploadedFiles: UploadedFile[] = [];
    let completedUploads = 0;

    try {
      for (const file of filesToUpload) {
        // Update progress
        const progress = (completedUploads / filesToUpload.length) * 100;
        setState(prev => ({ ...prev, progress }));
        onUploadProgress?.(progress, file);

        try {
          const uploadedFile = await uploadSingleFile(file);
          if (uploadedFile) {
            uploadedFiles.push(uploadedFile);
            setState(prev => ({
              ...prev,
              uploadedFiles: [...prev.uploadedFiles, uploadedFile],
            }));
          }
        } catch (error: any) {
          console.error('Upload error for file:', file.name, error);
          setState(prev => ({ ...prev, error: error.message }));
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }

        completedUploads++;
      }

      // Final progress update
      setState(prev => ({ ...prev, progress: 100 }));
      onAllUploadsComplete?.(uploadedFiles);

      if (uploadedFiles.length > 0) {
        toast.success(`Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length === 1 ? '' : 's'}`);
      }
    } finally {
      setState(prev => ({ ...prev, isUploading: false, progress: 0 }));
    }
  }, [uploadSingleFile, onUploadProgress, onAllUploadsComplete]);

  // Add files to upload queue
  const addFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(validation.error!);
      }
    }

    if (errors.length > 0) {
      setState(prev => ({ ...prev, error: errors.join('\n') }));
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      uploadQueueRef.current.push(...validFiles);
      
      if (autoUpload) {
        processUploadQueue();
      }
    }

    return validFiles.length;
  }, [validateFile, autoUpload, processUploadQueue]);

  // Handle file input change
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      addFiles(files);
    }
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFiles]);

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  // Open file picker
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Remove uploaded file
  const removeFile = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => 
        file.tempId !== fileId && file.url !== fileId
      ),
    }));
  }, []);

  // Cancel current upload
  const cancelUpload = useCallback(() => {
    if (currentUploadRef.current) {
      currentUploadRef.current.abort();
    }
    uploadQueueRef.current = [];
    setState(prev => ({ ...prev, isUploading: false, progress: 0 }));
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    cancelUpload();
    setState(prev => ({ ...prev, uploadedFiles: [], error: undefined }));
  }, [cancelUpload]);

  // Manual upload trigger
  const uploadFiles = useCallback(() => {
    if (uploadQueueRef.current.length > 0) {
      processUploadQueue();
    }
  }, [processUploadQueue]);

  // Get drag and drop props
  const getDragProps = useCallback(() => ({
    onDrop: handleDrop,
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDragEnter: (e: React.DragEvent) => e.preventDefault(),
  }), [handleDrop]);

  // Get file input props
  const getInputProps = useCallback(() => ({
    ref: fileInputRef,
    type: 'file' as const,
    multiple: maxFiles > 1,
    accept: getEffectiveConfig().allowedTypes.join(','),
    onChange: handleFileInputChange,
    style: { display: 'none' },
  }), [maxFiles, getEffectiveConfig, handleFileInputChange]);

  return {
    // State
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
    uploadedFiles: state.uploadedFiles,
    queueLength: uploadQueueRef.current.length,
    
    // Configuration
    config: getEffectiveConfig(),
    
    // Actions
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    cancelUpload,
    openFilePicker,
    
    // Props helpers
    getDragProps,
    getInputProps,
    
    // Validation
    validateFile,
  };
};

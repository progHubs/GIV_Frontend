// Enhanced File Upload Component
// Reusable file upload component with preview and validation

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: File | File[]) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  existingFileUrl?: string | null;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  maxSize?: number; // in MB
  showPreview?: boolean;
  placeholder?: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  onFileSelect,
  onFileRemove,
  selectedFile,
  existingFileUrl,
  children,
  className,
  disabled = false,
  maxSize = 10, // 10MB default
  showPreview = false,
  placeholder = 'Click to select file',
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (multiple) {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (!error) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        onFileSelect(validFiles);
      }
    } else {
      const file = files[0];
      const validationError = validateFile(file);

      if (!validationError) {
        onFileSelect(file);

        // Generate preview for images
        if (showPreview && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => setPreview(e.target?.result as string);
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Generate preview for selected file
  React.useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  // Handle file removal
  const handleRemoveFile = () => {
    if (onFileRemove) {
      onFileRemove();
    }
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine what to display
  const hasSelectedFile = selectedFile;
  const hasExistingFile = existingFileUrl && !hasSelectedFile;
  const displayUrl = hasSelectedFile ? preview : existingFileUrl;

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {children ? (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <motion.div
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
            isDragOver && !disabled
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500 bg-red-50 dark:bg-red-900/20'
          )}
        >
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                {placeholder}
              </span>
              {!disabled && <span> or drag and drop</span>}
            </div>
            {accept && (
              <p className="text-xs text-gray-500">
                Supported formats: {accept}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-gray-500">
                Max file size: {maxSize}MB
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Selected/Existing File Display */}
      {(hasSelectedFile || hasExistingFile) && (
        <div className="mt-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center space-x-3">
              {displayUrl && displayUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={displayUrl}
                  alt="File preview"
                  className="w-12 h-12 object-cover rounded border"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {hasSelectedFile ? selectedFile.name : 'Existing file'}
                </p>
                <p className="text-xs text-gray-500">
                  {hasSelectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Previously uploaded'}
                </p>
              </div>
            </div>
            {onFileRemove && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legacy Preview (for backward compatibility) */}
      {showPreview && preview && !hasSelectedFile && !hasExistingFile && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export { FileUpload };

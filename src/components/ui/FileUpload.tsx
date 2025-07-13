// File Upload Component
// Reusable file upload component

import React, { useRef } from 'react';
import { cn } from '../../lib/utils';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: File | File[]) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  onFileSelect,
  children,
  className,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (multiple) {
        onFileSelect(Array.from(files));
      } else {
        onFileSelect(files[0]);
      }
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('inline-block', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    </div>
  );
};

export { FileUpload };

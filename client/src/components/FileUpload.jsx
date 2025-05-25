import { useState } from 'react';
import { CloudUpload, FileText, X } from 'lucide-react';

function FileUpload({ onFileSelect, disabled = false, acceptedFileTypes, maxSize = 10 * 1024 * 1024 }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const validTypes = Object.keys(acceptedFileTypes || {});

  const validateFile = (file) => {
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a supported file.';
    }
    if (file.size > maxSize) {
      return `File is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`;
    }
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
      setError(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full ">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onClick={() => !disabled && document.getElementById('file-input').click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-destructive bg-destructive/10' : ''}
        `}
      >
        <input
          id="file-input"
          type="file"
          onChange={handleFileSelect}
          accept={validTypes.join(',')}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex items-center justify-center space-x-4">
            <FileText className="w-8 h-8 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#31304d]/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center">
              <CloudUpload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? 'Drop your resume here' : 'Drop your resume here'}
              </p>
              <p className="text-sm text-muted-foreground">or click to browse files</p>
            </div>
            <div className="text-xs text-muted-foreground">
              Supports PDF, DOC, DOCX (Max {Math.round(maxSize / (1024 * 1024))}MB)
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default FileUpload;

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';

interface FileProgress {
  [fileName: string]: number;
}

const DocumentUploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<FileProgress>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addNewFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 0) {
        addNewFiles(selectedFiles);
      }
    }
  };

  const addNewFiles = (newFiles: File[]): void => {
    // Initialize progress for new files
    const newProgress = {...uploadProgress};
    newFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    // Add files to state
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Simulate upload progress for each file
    newFiles.forEach(file => {
      simulateFileUpload(file.name);
    });
  };

  const simulateFileUpload = (fileName: string): void => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: progress
      }));
    }, 300);
  };

  const handleButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number): void => {
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      const fileName = updatedFiles[index].name;
      updatedFiles.splice(index, 1);
      
      // Remove from progress tracking
      setUploadProgress(prev => {
        const newProgress = {...prev};
        delete newProgress[fileName];
        return newProgress;
      });
      
      return updatedFiles;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white file-upload-container">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6">
          <h1 className="text-xl font-bold text-white">Document Upload</h1>
          <p className="text-blue-100 mt-1 text-xs">Secure file upload with preview</p>
        </div>

        <div className="p-6">
          {/* Drop zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-5 transition-all duration-200
              ${isDragging 
                ? 'dropzone-active' 
                : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-1">Drag and drop files here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors text-sm shadow-sm hover:shadow" 
                type="button"
              >
                Browse Files
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileInputChange}
              />
              <p className="text-xs text-gray-500 mt-4">Supported file types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
            </div>
          </div>
          
          {/* File list */}
          {files.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Uploaded Files ({files.length})
                </h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {files.map((file, index) => (
                  <li key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-gray-800 truncate" title={file.name}>{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <div className="mx-4 flex-1">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full upload-progress-bar ${
                                  uploadProgress[file.name] === 100 ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${uploadProgress[file.name]}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs font-medium text-gray-600 w-8">
                              {uploadProgress[file.name]}%
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className={`text-xs ${uploadProgress[file.name] === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                              {uploadProgress[file.name] < 100 ? 'Uploading...' : 'Complete'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Action buttons */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
                <button 
                  className="text-gray-500 hover:text-gray-700 text-xs font-medium py-1.5 px-3 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={() => setFiles([])}
                >
                  Clear All
                </button>
                <button 
                  className="bg-blue-500 text-white text-xs font-medium py-1.5 px-3 rounded hover:bg-blue-600 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          )}
          
          {/* Help text */}
          <div className="text-center text-gray-500 text-xs mt-4">
            <p>Need help? <a href="#" className="text-blue-500 hover:underline">Contact support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage;
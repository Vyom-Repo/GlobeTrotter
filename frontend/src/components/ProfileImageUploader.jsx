import React, { useRef, useState } from 'react';
import { Camera, User, X } from 'lucide-react';

export default function ProfileImageUploader({
  imagePreview,
  onImageChange,
  onImageRemove,
  label = "Photo"
}) {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        onImageChange(file, previewUrl);
      }
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        id="profile-photo-input"
        aria-label="Upload profile photo"
      />

      <div className="relative group">
        <div
          role="button"
          tabIndex={0}
          onClick={handleContainerClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 transition-all duration-300
            flex items-center justify-center cursor-pointer overflow-hidden relative shadow-md
            focus:outline-none focus:ring-4 focus:ring-accent-200
            ${imagePreview 
              ? 'border-accent-400 bg-white' 
              : 'border-dashed border-accent-300 bg-accent-50/70 hover:bg-accent-100/50 hover:border-accent-500'}
          `}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-accent-600 p-2 text-center">
              <User className="w-10 h-10 stroke-[1.5] mb-0.5 text-accent-500" />
              <span className="text-[10px] uppercase font-bold tracking-wider italic text-accent-700">
                {label}
              </span>
            </div>
          )}

          {/* Hover overlay indicator */}
          <div
            className={`
              absolute inset-0 bg-accent-900/60 backdrop-blur-[2px] transition-opacity duration-200
              flex flex-col items-center justify-center text-white text-xs font-semibold italic
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <Camera className="w-5 h-5 mb-1" />
            <span>{imagePreview ? 'Change' : 'Upload'}</span>
          </div>
        </div>

        {/* Remove button if image is selected */}
        {imagePreview && onImageRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onImageRemove();
            }}
            aria-label="Remove profile photo"
            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <span className="text-xs text-slate-500 italic mt-2">
        {imagePreview ? 'Click to change photo' : 'Click circle to select profile photo'}
      </span>
    </div>
  );
}

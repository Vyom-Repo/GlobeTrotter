import React, { useState, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, Edit2, X } from 'lucide-react';

export const CoverPhotoUploader = ({
  coverUrl,
  onChangeCover,
  onRemoveCover
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const sampleCovers = [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80'
  ];

  const handleFile = (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const mockUrl = URL.createObjectURL(file);
          onChangeCover(mockUrl);
          return 0;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sampleUrl) => {
    setIsUploading(true);
    setUploadProgress(40);
    setTimeout(() => {
      onChangeCover(sampleUrl);
      setIsUploading(false);
      setUploadProgress(0);
    }, 300);
  };

  return (
    <div className="w-full lg:w-[280px] shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !coverUrl && fileInputRef.current?.click()}
        className={`
          relative w-full h-[220px] lg:h-[280px] rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center p-4 group
          ${coverUrl ? 'bg-surface-raised border border-accent-200/60 shadow-neo-raised' : ''}
          ${!coverUrl && isDragging ? 'bg-surface-sunken border-2 border-dashed border-accent-400 shadow-neo-pressed' : ''}
          ${!coverUrl && !isDragging ? 'bg-surface-raised border border-accent-200/50 shadow-neo-raised hover:border-accent-300' : ''}
        `}
      >
        {coverUrl ? (
          <>
            {/* Background cover image */}
            <img
              src={coverUrl}
              alt="Trip Cover"
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
              Cover Photo Attached
            </div>

            {/* Action Icon Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="w-9 h-9 rounded-full bg-surface-raised/90 backdrop-blur-md text-ink-900 shadow-neo-raised hover:bg-white flex items-center justify-center transition-all"
                title="Change photo"
              >
                <Edit2 className="w-4 h-4 text-accent-700" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCover();
                }}
                className="w-9 h-9 rounded-full bg-surface-raised/90 backdrop-blur-md text-semantic-danger shadow-neo-raised hover:bg-white flex items-center justify-center transition-all"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-surface-sunken shadow-neo-pressed flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {isDragging ? (
                <UploadCloud className="w-7 h-7 text-accent-400 animate-bounce" />
              ) : (
                <ImageIcon className="w-7 h-7 text-accent-300" />
              )}
            </div>
            <h4 className="font-display font-semibold text-base text-ink-900 mb-1">
              {isDragging ? "Drop your photo here" : "Add a cover photo"}
            </h4>
            <p className="text-xs text-ink-500 max-w-[200px] leading-relaxed">
              Drag & drop, tap to upload, or pick a sample photo below.
            </p>
          </div>
        )}

        {/* Upload progress bar */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-surface-sunken">
            <div
              className="h-full bg-accent-400 transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Preset sample photo pickers when empty */}
      {!coverUrl && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase text-ink-500">Quick presets:</span>
          <div className="flex gap-2">
            {sampleCovers.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="w-8 h-8 rounded-md overflow-hidden border border-accent-200 shadow-sm hover:scale-110 transition-transform"
              >
                <img src={sample} alt="Preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

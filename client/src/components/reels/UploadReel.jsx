import React, { useState, useRef } from 'react';
import api from '../../api';
import { X, Loader2, Image as ImageIcon, Video, CheckCircle2, ChevronRight, Music, MapPin, Tag, ArrowLeft } from 'lucide-react';

const UploadReel = ({ isOpen, onClose, onUploadSuccess }) => {
  const [step, setStep] = useState(1); // 1: Choose Type, 2: Select File, 3: Caption/Details
  const [selection, setSelection] = useState(null); // 'post' or 'reel'
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const reset = () => {
    setStep(1);
    setSelection(null);
    setMedia(null);
    setPreview(null);
    setCaption('');
    setUploading(false);
  };

  const handleTypeSelect = (type) => {
    setSelection(type);
    setStep(2);
    // Automatically trigger file input
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate type based on selection
      if (selection === 'reel' && !file.type.startsWith('video')) {
         return alert('Please select a video for Reels');
      }
      if (selection === 'post' && !file.type.startsWith('image')) {
         return alert('Please select an image for Posts');
      }
      
      setMedia(file);
      setPreview(URL.createObjectURL(file));
      setStep(3);
    }
  };

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!media || !caption) return alert('Please provide all details');

    setUploading(true);
    const formData = new FormData();
    formData.append('media', media);
    formData.append('caption', caption);
    formData.append('mediaType', selection === 'reel' ? 'video' : 'image');

    try {
      await api.post('/api/reels/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`${selection.toUpperCase()} shared successfully!`);
      reset();
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-white md:rounded-[2.5rem] w-full max-w-2xl h-full md:h-auto overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <div className="flex items-center space-x-4">
             {step > 1 && !uploading && (
               <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-gray-100 rounded-full">
                 <ArrowLeft size={24} />
               </button>
             )}
             <h2 className="text-xl font-black text-black">
               {step === 1 ? 'New Create' : step === 2 ? 'Select Media' : 'New Post'}
             </h2>
          </div>
          {step === 3 && (
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="text-india-blue font-black text-lg hover:opacity-70 disabled:opacity-50"
            >
              Share
            </button>
          )}
          {step === 1 && (
            <button onClick={() => { onClose(); reset(); }} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
           {/* Step 1: Instagram Style Category Selection */}
           {step === 1 && (
             <div className="p-8 grid grid-cols-1 gap-6">
                <button 
                  onClick={() => handleTypeSelect('post')}
                  className="group relative flex items-center justify-between p-8 rounded-[2rem] bg-gray-50 hover:bg-india-saffron/5 border-2 border-transparent hover:border-india-saffron transition-all"
                >
                  <div className="flex items-center space-x-6">
                     <div className="p-5 bg-white rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                        <ImageIcon size={32} className="text-india-saffron" />
                     </div>
                     <div className="text-left">
                        <p className="font-black text-xl text-gray-800 uppercase tracking-tight">Post</p>
                        <p className="text-sm text-gray-400 font-bold">Share photos to your feed</p>
                     </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-300" />
                </button>

                <button 
                  onClick={() => handleTypeSelect('reel')}
                  className="group relative flex items-center justify-between p-8 rounded-[2rem] bg-gray-50 hover:bg-india-blue/5 border-2 border-transparent hover:border-india-blue transition-all"
                >
                  <div className="flex items-center space-x-6">
                     <div className="p-5 bg-white rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                        <Video size={32} className="text-india-blue" />
                     </div>
                     <div className="text-left">
                        <p className="font-black text-xl text-gray-800 uppercase tracking-tight">Reel</p>
                        <p className="text-sm text-gray-400 font-bold">Share 1-2 min videos</p>
                     </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-300" />
                </button>
             </div>
           )}

           {/* Step 2: Hidden Input Triggered by Step 1 */}
           <input type="file" ref={fileInputRef} className="hidden" accept={selection === 'reel' ? 'video/*' : 'image/*'} onChange={handleFileChange} />

           {/* Step 3: Edit & Details */}
           {step === 3 && (
             <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-[60%] bg-black aspect-square flex items-center justify-center">
                   {selection === 'reel' ? (
                     <video src={preview} className="w-full h-full object-contain" controls />
                   ) : (
                     <img src={preview} className="w-full h-full object-contain" alt="preview" />
                   )}
                </div>
                <div className="w-full md:w-[40%] p-6 space-y-6">
                   <textarea 
                     className="w-full h-40 border-none outline-none resize-none text-sm font-bold placeholder-gray-300"
                     placeholder="Write a caption..."
                     value={caption}
                     onChange={(e) => setCaption(e.target.value)}
                   />
                   <div className="space-y-4 border-t border-gray-50 pt-6">
                      <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded-xl">
                         <span className="text-sm font-bold text-gray-600">Add Music</span>
                         <Music size={18} className="text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded-xl">
                         <span className="text-sm font-bold text-gray-600">Add Location</span>
                         <MapPin size={18} className="text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded-xl">
                         <span className="text-sm font-bold text-gray-600">Tag People</span>
                         <Tag size={18} className="text-gray-400" />
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-[110] flex flex-col items-center justify-center space-y-4">
             <Loader2 size={48} className="animate-spin text-india-blue" />
             <p className="font-black text-lg tracking-widest text-india-blue uppercase">Sharing Content...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadReel;

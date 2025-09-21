"use client"
import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { setProfilePic } from '@/actions/useractions';
import { toast, Bounce } from 'react-toastify';
import Modal from "./Modal";

const CoverPicModal = ({ isOpen, onClose, initialData, onSave, username }) => {
  const [coverPicResource, setCoverPicResource] = useState();
  const [uploading, setUploading] = useState(false);

  const handleCoverPicUpload = async (result) => {
    if (!username) {
      toast.error('Please login to upload images');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = result.info.secure_url;
      
      // Update cover pic in database
      await setProfilePic(username, { coverPic: imageUrl });
      
      setCoverPicResource(result.info);
      
      // Update parent component state
      onSave && onSave({ ...initialData, coverPic: imageUrl });
      
      toast.success('Cover picture updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
      
      // Close modal after successful upload
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      toast.error('Failed to update cover picture');
      console.error('Cover pic upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Cover Picture">
      <div className="space-y-6">
        {/* Current Cover Picture */}
        <div className="text-center">
          <img 
            src={coverPicResource?.secure_url || initialData?.coverPic || '/luffy.jpeg'} 
            alt="Cover preview" 
            className="w-full h-32 rounded-lg object-cover border-4 border-cyan-400 shadow-lg"
          />
          <p className="text-center text-sm text-gray-400 mt-3">Current cover picture</p>
        </div>

        {/* Upload Widget */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            options={{
              maxFiles: 1,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
              maxFileSize: 10000000, // 10MB
              folder: "getmefund/covers",
              cropping: true,
              croppingAspectRatio: 2.5, // Wide aspect ratio for cover pics
              quality: "auto:good"
            }}
            onSuccess={(result) => handleCoverPicUpload(result)}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => (
              <button 
                onClick={() => {
                  setCoverPicResource(undefined);
                  open();
                }}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Choose New Cover Picture'}
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Upload Guidelines */}
        <div className="bg-gray-800/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-cyan-400">Upload Guidelines</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Wide aspect ratio (2.5:1) recommended</li>
            <li>• Maximum 10MB file size</li>
            <li>• JPG, PNG, GIF, or WebP formats</li>
            <li>• Image will be automatically cropped to fit</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default CoverPicModal;
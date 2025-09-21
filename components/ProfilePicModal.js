"use client"
import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { setProfilePic } from '@/actions/useractions';
import { toast, Bounce } from 'react-toastify';
import Modal from "./Modal";

const ProfilePicModal = ({ isOpen, onClose, initialData, onSave, username }) => {
  const [profilePicResource, setProfilePicResource] = useState();
  const [uploading, setUploading] = useState(false);

  const handleProfilePicUpload = async (result) => {
    if (!username) {
      toast.error('Please login to upload images');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = result.info.secure_url;
      
      // Update profile pic in database
      await setProfilePic(username, { profilePic: imageUrl });
      
      setProfilePicResource(result.info);
      
      // Update parent component state
      onSave && onSave({ ...initialData, profilePic: imageUrl });
      
      toast.success('Profile picture updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
      
      // Close modal after successful upload
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      toast.error('Failed to update profile picture');
      console.error('Profile pic upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile Picture">
      <div className="space-y-6">
        {/* Current Profile Picture */}
        <div className="text-center">
          <img 
            src={profilePicResource?.secure_url || initialData?.profilePic || '/pp.png'} 
            alt="Profile preview" 
            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-cyan-400 shadow-lg"
          />
          <p className="text-center text-sm text-gray-400 mt-3">Current profile picture</p>
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
              folder: "getmefund/profiles",
              cropping: true,
              croppingAspectRatio: 1, // Square aspect ratio for profile pics
              gravity: "face",
              quality: "auto:good"
            }}
            onSuccess={(result) => handleProfilePicUpload(result)}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => (
              <button 
                onClick={() => {
                  setProfilePicResource(undefined);
                  open();
                }}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Choose New Profile Picture'}
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Upload Guidelines */}
        <div className="bg-gray-800/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-cyan-400">Upload Guidelines</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Square aspect ratio (1:1) recommended</li>
            <li>• Maximum 10MB file size</li>
            <li>• JPG, PNG, GIF, or WebP formats</li>
            <li>• Image will be automatically cropped to fit</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ProfilePicModal;
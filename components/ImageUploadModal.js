"use client"
import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from 'next-auth/react';
import { setProfilePic } from '@/actions/useractions';
import { toast, Bounce } from 'react-toastify';
import Modal from "./Modal";

const ImageUploadModal = ({ isOpen, onClose, initialData, onSave, username }) => {
  const { data: session, update } = useSession();
  const [profilePicResource, setProfilePicResource] = useState();
  const [coverPicResource, setCoverPicResource] = useState();
  const [uploading, setUploading] = useState({ profile: false, cover: false });

  const handleProfilePicUpload = async (result) => {
    if (!username) {
      toast.error('Please login to upload images');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, profile: true }));
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
    } catch (error) {
      toast.error('Failed to update profile picture');
      console.error('Profile pic upload error:', error);
    } finally {
      setUploading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleCoverPicUpload = async (result) => {
    if (!username) {
      toast.error('Please login to upload images');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, cover: true }));
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
    } catch (error) {
      toast.error('Failed to update cover picture');
      console.error('Cover pic upload error:', error);
    } finally {
      setUploading(prev => ({ ...prev, cover: false }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Images">
      <div className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Profile Picture</h3>
          
          {(profilePicResource || initialData?.profilePic) && (
            <div className="mb-4">
              <img 
                src={profilePicResource?.secure_url || initialData?.profilePic} 
                alt="Profile preview" 
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-cyan-400"
              />
              <p className="text-center text-sm text-gray-400 mt-2">Current profile picture</p>
            </div>
          )}
          
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
                disabled={uploading.profile}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {uploading.profile ? 'Uploading...' : 'Upload Profile Picture'}
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Cover Picture Upload */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Cover Picture</h3>
          
          {(coverPicResource || initialData?.coverPic) && (
            <div className="mb-4">
              <img 
                src={coverPicResource?.secure_url || initialData?.coverPic} 
                alt="Cover preview" 
                className="w-full h-20 rounded-lg object-cover border-2 border-cyan-400"
              />
              <p className="text-center text-sm text-gray-400 mt-2">Current cover picture</p>
            </div>
          )}
          
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
                disabled={uploading.cover}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {uploading.cover ? 'Uploading...' : 'Upload Cover Picture'}
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Usage Guidelines */}
        <div className="bg-gray-800/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-cyan-400">Upload Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
            <div>
              <p className="font-medium text-gray-300 mb-1">Profile Picture:</p>
              <ul className="space-y-0.5">
                <li>• Square aspect ratio (1:1)</li>
                <li>• Maximum 10MB file size</li>
                <li>• JPG, PNG, GIF, or WebP</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-300 mb-1">Cover Picture:</p>
              <ul className="space-y-0.5">
                <li>• Wide aspect ratio (2.5:1)</li>
                <li>• Maximum 10MB file size</li>
                <li>• JPG, PNG, GIF, or WebP</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageUploadModal;
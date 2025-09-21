"use client"
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { setPersonalInfo } from "@/actions/useractions";
import { toast, Bounce } from 'react-toastify';
import { useSession } from "next-auth/react";


const PersonalInfoModal = ({ isOpen, onClose, initialData, onSave, username }) => {
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    if (isOpen) setForm(initialData);
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
    onSave && onSave(form);
    await setPersonalInfo(username, form);
    await updateSession();
    await setPersonalInfo(username, form);
    toast.success('Personal information updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    onClose();
    } catch (error) {
      if (error.message === "Username already taken") {
        toast.error('Username already taken! Please choose a different one.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.error('Failed to update personal information. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
      }
      console.error('Error updating personal info:', error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Personal Information">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            type="text"
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 rounded-lg"
        >
          Save
        </button>
      </form>
    </Modal>
  );
};

export default PersonalInfoModal;
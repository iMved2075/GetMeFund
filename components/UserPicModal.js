"use client"
import React, { useState, useEffect } from 'react'
import Modal from "./Modal";
import { setProfilePic } from '@/actions/useractions';
import { useSession } from 'next-auth/react';

const UserPicModal = ({ isOpen, onClose, initialLinks, onSave, messageReceiver, username }) => {
    const [form, setForm] = useState(initialLinks);
    const { data: session, update: updateSession } = useSession();

    useEffect(() => {
        if (isOpen) setForm(initialLinks);
        console.log(initialLinks);
    }, [isOpen, initialLinks]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave && onSave(form);
        await setProfilePic(username, form);
        messageReceiver && messageReceiver("Profile Updated Successfully");
        await updateSession();
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Picture">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Profile Picture URL</label>
                    <input
                        type="text"
                        name="profilePic"
                        value={form.profilePic}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Cover Picture URL</label>
                    <input
                        type="text"
                        name="coverPic"
                        value={form.coverPic}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
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
    )
}

export default UserPicModal

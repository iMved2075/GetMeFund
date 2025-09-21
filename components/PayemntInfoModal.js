"use client"
import React, { useState, useEffect } from 'react'
import Modal from "./Modal";
import { setPaymentInfo } from '@/actions/useractions';

const PaymentInfoModal = ({ isOpen, onClose, initialData, onSave, username }) => {
    const [form, setForm] = useState(initialData);

    useEffect(() => {
        if (isOpen) setForm(initialData);
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave && onSave(form);
        setPaymentInfo(username, form);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Payment Information">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Publishable Key</label>
                    <input
                        type="text"
                        name="publishableKey"
                        value={form.publishableKey}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Secret Key</label>
                    <input
                        type="text"
                        name="secretKey"
                        value={form.secretKey}
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

export default PaymentInfoModal

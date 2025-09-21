import { useState, useEffect } from "react";
import Modal from "./Modal";
import { setSocialLinks } from "@/actions/useractions";

const Social = ({ isOpen, onClose, initialLinks, onSave, username }) => {
  const [links, setLinks] = useState(initialLinks);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) setLinks(initialLinks);
  }, [isOpen, initialLinks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated social links:", links);
    if (onSave) onSave(links);
    setSocialLinks(username, links);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Social Links">
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Facebook", name: "facebook", placeholder: "https://facebook.com/username" },
          { label: "X (Twitter)", name: "twitter", placeholder: "https://x.com/username" },
          { label: "LinkedIn", name: "linkedin", placeholder: "https://linkedin.com/in/username" },
          { label: "Instagram", name: "instagram", placeholder: "https://instagram.com/username" },
          { label: "GitHub", name: "github", placeholder: "https://github.com/username" },
          { label: "YouTube", name: "youtube", placeholder: "https://youtube.com/@username" },
        ].map(({ label, name, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <input
              type="url"
              name={name}
              value={links[name] || ""}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg mt-4"
        >
          Save Links
        </button>
      </form>
    </Modal>
  );
};

export default Social;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Globe } from "lucide-react";

const LeadModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website_form",
    status: "new",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    setForm({ name: "", email: "", phone: "", source: "website_form", status: "new" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold">Add New Lead</h2>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  <User className="w-4 h-4 inline mr-1" /> Full Name *
                </label>
                <input
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-white/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  <Mail className="w-4 h-4 inline mr-1" /> Email *
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-white/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  <Phone className="w-4 h-4 inline mr-1" /> Phone
                </label>
                <input
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-white/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  <Globe className="w-4 h-4 inline mr-1" /> Source
                </label>
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-white/50"
                >
                  <option value="website_form">🌐 Website Form</option>
                  <option value="referral">👥 Referral</option>
                  <option value="social_media">📱 Social Media</option>
                  <option value="email_campaign">📧 Email Campaign</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-white/50"
                >
                  <option value="new">🟢 New</option>
                  <option value="contacted">🔵 Contacted</option>
                  <option value="converted">🟣 Converted</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Save Lead
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadModal;
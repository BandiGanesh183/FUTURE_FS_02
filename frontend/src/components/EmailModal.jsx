import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailModal = ({ isOpen, onClose, leadEmail, leadName }) => {
  const [formData, setFormData] = useState({
    to: leadEmail || '',
    subject: 'Follow up about your lead inquiry',
    message: `Hello ${leadName || ''},\n\nI hope you're doing well.\n\nI wanted to follow up regarding your interest in our services.\n\nPlease let me know if you have any questions.\n\nBest regards,\nCRM Team`
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSend = async () => {
    setSending(true);
    
    // This will open default email client
    const mailtoLink = `mailto:${formData.to}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
    window.location.href = mailtoLink;
    
    setTimeout(() => {
      toast.success('Email client opened!');
      setSending(false);
      onClose();
    }, 500);
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Compose Email
              </h2>
              <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                  <User className="w-4 h-4 inline mr-1" /> To
                </label>
                <input
                  type="email"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:bg-gray-700 dark:text-white"
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                  <MessageSquare className="w-4 h-4 inline mr-1" /> Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="8"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={sending}
                className="btn-gradient-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Opening Email Client...' : 'Send Email'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailModal;
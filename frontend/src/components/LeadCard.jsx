import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Edit, Trash2, Save, XCircle, Globe, User } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const LeadCard = ({ lead, onUpdate, onDelete, isCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    source: lead.source,
    status: lead.status
  });
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700', icon: '🟢' };
      case 'contacted': return { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', icon: '🔵' };
      case 'converted': return { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', icon: '🟣' };
      default: return { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-700', icon: '⚪' };
    }
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'website_form': return '🌐';
      case 'referral': return '👥';
      case 'social_media': return '📱';
      case 'email_campaign': return '📧';
      default: return '📝';
    }
  };

  const statusColors = getStatusColor(lead.status);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      source: lead.source,
      status: lead.status
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.put(
        `http://localhost:5000/api/leads/${lead.id}`,
        editData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Lead updated successfully!');
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      toast.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${lead.name}"?`)) {
      onDelete(lead.id, lead.name);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = getToken();
      await axios.patch(
        `http://localhost:5000/api/leads/${lead.id}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success(`Status changed to ${newStatus}`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      {/* Header with gradient based on status */}
      <div className={`h-2 ${statusColors.bg}`}></div>
      
      <div className="p-5">
        {/* Name and Status */}
        <div className="flex justify-between items-start mb-3">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              className="input-modern text-lg font-bold py-1 px-2"
              placeholder="Name"
            />
          ) : (
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {lead.name}
              {isCurrentUser && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">You</span>}
            </h3>
          )}
          
          {!isEditing && (
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`${statusColors.light} ${statusColors.text} px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border-0`}
            >
              <option value="new">🟢 New</option>
              <option value="contacted">🔵 Contacted</option>
              <option value="converted">🟣 Converted</option>
            </select>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="input-modern text-sm py-1 px-2 flex-1"
                placeholder="Email"
              />
            ) : (
              <span className="text-sm">{lead.email}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="input-modern text-sm py-1 px-2 flex-1"
                placeholder="Phone"
              />
            ) : (
              <span className="text-sm">{lead.phone || 'No phone'}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="w-4 h-4 text-gray-400" />
            {isEditing ? (
              <select
                name="source"
                value={editData.source}
                onChange={handleChange}
                className="input-modern text-sm py-1 px-2 flex-1"
              >
                <option value="website_form">🌐 Website Form</option>
                <option value="referral">👥 Referral</option>
                <option value="social_media">📱 Social Media</option>
                <option value="email_campaign">📧 Email Campaign</option>
                <option value="other">📝 Other</option>
              </select>
            ) : (
              <span className="text-sm">
                {getSourceIcon(lead.source)} {lead.source?.replace('_', ' ')}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeadCard;
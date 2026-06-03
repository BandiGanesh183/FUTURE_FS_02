import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Calendar, Globe, User, Loader, AtSign, Smartphone } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/leads/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          setLead(response.data.data);
        } else {
          toast.error("Lead not found");
        }
      } catch (err) {
        console.error("Error fetching lead:", err);
        toast.error(err.response?.data?.message || "Failed to load lead details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLead();
    }
  }, [id]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-emerald-100 text-emerald-700';
      case 'contacted': return 'bg-blue-100 text-blue-700';
      case 'converted': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'new': return '🟢';
      case 'contacted': return '🔵';
      case 'converted': return '🟣';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading lead details...</span>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Lead not found</p>
        <button 
          onClick={() => navigate('/leads')} 
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
        Back to Leads
      </button>

      {/* Lead Details Card - White Theme */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{lead.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">Lead ID: #{lead.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lead.status)}`}>
              {getStatusIcon(lead.status)} {lead.status?.toUpperCase()}
            </span>
            <span className="text-sm text-gray-400 ml-4">
              Added on {new Date(lead.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Contact Information</h3>
            
            {/* Email */}
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                <p className="text-gray-700 font-medium">{lead.email}</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <Smartphone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                <p className="text-gray-700 font-medium">{lead.phone || 'Not provided'}</p>
              </div>
            </div>
            
            {/* Source */}
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Source</p>
                <p className="text-gray-700 font-medium capitalize">{lead.source?.replace('_', ' ') || '-'}</p>
              </div>
            </div>
            
            {/* Last Updated */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Last Updated</p>
                <p className="text-gray-700 font-medium">{new Date(lead.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {lead.notes && lead.notes.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-600">{lead.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={() => window.location.href = `mailto:${lead.email}?subject=Follow up about your lead&body=Hello ${lead.name},%0D%0A%0D%0AI hope you're doing well.%0D%0A%0D%0ABest regards,%0D%0ACRM Team`}
              className="flex-1 bg-purple-600 text-white rounded-xl py-2.5 font-semibold text-sm hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-2.5 font-semibold text-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Back to Leads
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadDetail;
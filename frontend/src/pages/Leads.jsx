import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, RefreshCw, Filter, X, Trash2, Edit, Save, XCircle, Download, Mail, Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddLeadModal from '../components/AddLeadModal';

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeStatus, setActiveStatus] = useState('all');
  const [editingLead, setEditingLead] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: ''
  });

  // Get user info for email signature
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const statusOptions = [
    { value: 'all', label: 'All Leads', color: 'bg-gray-500' },
    { value: 'new', label: 'New', color: 'bg-emerald-500' },
    { value: 'contacted', label: 'Contacted', color: 'bg-blue-500' },
    { value: 'converted', label: 'Converted', color: 'bg-purple-500' }
  ];

  const getToken = () => localStorage.getItem('token');

  const fetchLeads = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/leads', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLeadAdded = async () => {
    setLoading(true);
    await fetchLeads();
    toast.success('Lead added successfully!');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeads();
    toast.success('Leads refreshed!');
  };

  // Export CSV Function
  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing export...', { id: 'export' });
      
      const token = getToken();
      const response = await axios.get('http://localhost:5000/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const allLeads = response.data.data;
        
        const headers = ['Name', 'Email', 'Phone', 'Status', 'Source', 'Created At'];
        const csvRows = [headers.join(',')];
        
        allLeads.forEach(lead => {
          const row = [
            `"${lead.name}"`,
            `"${lead.email}"`,
            `"${lead.phone || ''}"`,
            lead.status,
            lead.source,
            new Date(lead.createdAt).toLocaleDateString()
          ];
          csvRows.push(row.join(','));
        });
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast.success(`Exported ${allLeads.length} leads successfully!`, { id: 'export' });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads', { id: 'export' });
    }
  };

  // Send Email Function
  const sendEmailToLead = (email, name) => {
    const subject = `Follow up about your lead inquiry`;
    const body = `Hello ${name},%0D%0A%0D%0AI hope you're doing well.%0D%0A%0D%0AI wanted to follow up regarding your interest in our services.%0D%0A%0D%0APlease let me know if you have any questions or if there's anything I can help you with.%0D%0A%0D%0ABest regards,%0D%0A${user?.name || 'CRM Team'}%0D%0A${user?.email || ''}`;
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    toast.success(`Opening email client for ${name}`);
  };

  // Start editing a lead
  const startEditing = (lead) => {
    setEditingLead(lead.id);
    setEditFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      source: lead.source,
      status: lead.status
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingLead(null);
    setEditFormData({ name: '', email: '', phone: '', source: '', status: '' });
  };

  // Save edited lead
  const saveEdit = async (leadId) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `http://localhost:5000/api/leads/${leadId}`,
        editFormData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Lead updated successfully!');
        setEditingLead(null);
        fetchLeads();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error(error.response?.data?.message || 'Failed to update lead');
    }
  };

  // Handle edit input change
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const token = getToken();
      const response = await axios.patch(
        `http://localhost:5000/api/leads/${leadId}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Status changed to ${newStatus.toUpperCase()}`);
        fetchLeads();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteLead = async (leadId, leadName) => {
    if (window.confirm(`Are you sure you want to delete "${leadName}"?`)) {
      try {
        const token = getToken();
        const response = await axios.delete(`http://localhost:5000/api/leads/${leadId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          toast.success('Lead deleted successfully!');
          fetchLeads();
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'new':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'contacted':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'converted':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(search.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === 'all' || lead.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status) => {
    if (status === 'all') return leads.length;
    return leads.filter(lead => lead.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin-slow w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-gray-600">Loading leads...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold gradient-text-primary"
        >
          Leads Management ({filteredLeads.length} / {leads.length})
        </motion.h1>
        <div className="flex gap-3">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="btn-outline-modern flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-outline-modern flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin-slow' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      {/* Filter by status */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter by status:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => setActiveStatus(status.value)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-200
                ${activeStatus === status.value 
                  ? `${status.color} text-white shadow-lg scale-105` 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {status.label}
              <span className={`
                ml-2 px-2 py-0.5 rounded-full text-xs
                ${activeStatus === status.value 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 text-gray-600'}
              `}>
                {getStatusCount(status.value)}
              </span>
            </button>
          ))}
          {activeStatus !== 'all' && (
            <button
              onClick={() => setActiveStatus('all')}
              className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Search Bar and Add Lead Button - Side by Side with shorter search */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Search Bar - Reduced width */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
            />
          </div>
          
          {/* Add New Lead Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient-primary flex items-center justify-center gap-2 px-5 py-2.5 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </motion.button>
        </div>
      </motion.div>

      {/* Leads Table */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto rounded-xl border border-gray-200"
      >
        <table className="table-modern w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Source</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {leads.length === 0 
                    ? 'No leads found. Click "Add New Lead" to create one.' 
                    : `No ${activeStatus} leads found.`}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200"
                >
                  {editingLead === lead.id ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          className="input-modern text-sm py-1 w-full"
                          placeholder="Name"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          className="input-modern text-sm py-1 w-full"
                          placeholder="Email"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="phone"
                          value={editFormData.phone}
                          onChange={handleEditChange}
                          className="input-modern text-sm py-1 w-full"
                          placeholder="Phone"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditChange}
                          className="input-modern text-sm py-1 w-full"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="source"
                          value={editFormData.source}
                          onChange={handleEditChange}
                          className="input-modern text-sm py-1 w-full"
                        >
                          <option value="website_form">Website Form</option>
                          <option value="referral">Referral</option>
                          <option value="social_media">Social Media</option>
                          <option value="email_campaign">Email Campaign</option>
                          <option value="other">Other</option>
                        </select>
                        </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(lead.createdAt).toLocaleDateString()}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(lead.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1.5 rounded-lg transition"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4 font-medium text-gray-800">{lead.name}</td>
                      <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                      <td className="px-6 py-4 text-gray-600">{lead.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`
                            cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold 
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${getStatusStyle(lead.status)}
                            hover:shadow-md min-w-[110px]
                          `}
                        >
                          <option value="new">🟢 New</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="converted">🟣 Converted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{lead.source?.replace('_', ' ') || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Eye Icon - View Details */}
                          <button
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1.5 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* Email Icon */}
                          <button
                            onClick={() => sendEmailToLead(lead.email, lead.name)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-1.5 rounded-lg transition"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          {/* Edit Icon */}
                          <button
                            onClick={() => startEditing(lead)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* Delete Icon */}
                          <button
                            onClick={() => deleteLead(lead.id, lead.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLeadAdded={handleLeadAdded}
      />
    </motion.div>
  );
};

export default Leads;
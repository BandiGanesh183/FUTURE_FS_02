import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, PhoneCall, Trophy, TrendingUp, RefreshCw, 
  Download, Eye, Clock, Activity, PieChart, ArrowUp,
  Mail, Calendar, CheckCircle, AlertCircle, BarChart3,
  LogOut, X, Save, User, Phone, Mail as MailIcon, MapPin, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    conversionRate: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Schedule state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    leadId: ''
  });
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [selectedLeadForSchedule, setSelectedLeadForSchedule] = useState(null);

  // Lead Details Modal State
  const [showLeadDetailsModal, setShowLeadDetailsModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success('Logged out successfully!');
    navigate("/login");
  };

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    fetchDashboardData();
    loadSavedSchedules();
  }, []);

  // Load saved schedules from localStorage
  const loadSavedSchedules = () => {
    const saved = localStorage.getItem('schedules');
    if (saved) {
      setSavedSchedules(JSON.parse(saved));
    }
  };

  // Save schedule to localStorage
  const saveScheduleToLocal = (schedule) => {
    const updatedSchedules = [...savedSchedules, schedule];
    setSavedSchedules(updatedSchedules);
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const analyticsRes = await api.get('/leads/analytics');
      if (analyticsRes.data.success) {
        setStats(analyticsRes.data.data);
      }

      const leadsRes = await api.get('/leads?limit=5');
      if (leadsRes.data.success) {
        setRecentLeads(leadsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed!');
  };

  const handleExport = async () => {
    try {
      toast.loading('Preparing export...', { id: 'export' });
      
      const response = await api.get('/leads');
      if (response.data.success) {
        const leads = response.data.data;
        
        const headers = ['Name', 'Email', 'Phone', 'Status', 'Source', 'Created At'];
        const csvRows = [headers.join(',')];
        
        leads.forEach(lead => {
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
        
        toast.success('Export completed!', { id: 'export' });
      }
    } catch (error) {
      toast.error('Export failed', { id: 'export' });
    }
  };

  const handleAddLead = () => {
    navigate('/leads');
    setTimeout(() => {
      const addButton = document.querySelector('.btn-gradient-primary');
      if (addButton) addButton.click();
    }, 500);
  };

  const handleSendEmail = () => {
    window.location.href = 'mailto:?subject=Lead%20Management%20CRM';
    toast.success('Opening email client...');
  };

  // Fixed Schedule function with modal
  const handleSchedule = () => {
    setScheduleData({
      title: '',
      date: '',
      time: '',
      description: '',
      leadId: ''
    });
    setSelectedLeadForSchedule(null);
    setShowScheduleModal(true);
  };

  // Schedule for specific lead
  const handleScheduleForLead = (lead) => {
    setSelectedLeadForSchedule(lead);
    setScheduleData({
      title: `Follow up with ${lead.name}`,
      date: '',
      time: '',
      description: `Follow up meeting with ${lead.name}`,
      leadId: lead.id
    });
    setShowScheduleModal(true);
  };

  // Handle view lead details - Shows modal with lead information
  const handleViewLead = async (leadId) => {
    try {
      toast.loading('Loading lead details...', { id: 'viewLead' });
      
      // Fetch the complete lead details from API
      const response = await api.get(`/leads/${leadId}`);
      if (response.data.success) {
        setSelectedLead(response.data.data);
        setShowLeadDetailsModal(true);
        toast.success('Lead details loaded!', { id: 'viewLead' });
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
      toast.error('Failed to load lead details', { id: 'viewLead' });
      
      // If API fails, try to find the lead from recentLeads
      const lead = recentLeads.find(l => l.id === leadId);
      if (lead) {
        setSelectedLead(lead);
        setShowLeadDetailsModal(true);
        toast.success('Lead details loaded!', { id: 'viewLead' });
      }
    }
  };

  const handleScheduleInputChange = (e) => {
    setScheduleData({
      ...scheduleData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveSchedule = () => {
    // Validation
    if (!scheduleData.title.trim()) {
      toast.error('Please enter a schedule title');
      return;
    }
    if (!scheduleData.date) {
      toast.error('Please select a date');
      return;
    }
    if (!scheduleData.time) {
      toast.error('Please select a time');
      return;
    }

    const newSchedule = {
      id: Date.now(),
      ...scheduleData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    saveScheduleToLocal(newSchedule);
    
    toast.success('Schedule saved successfully!', {
      icon: '📅',
      duration: 3000
    });
    
    setShowScheduleModal(false);
    setScheduleData({
      title: '',
      date: '',
      time: '',
      description: '',
      leadId: ''
    });
  };

  const handleDeleteSchedule = (scheduleId) => {
    const updatedSchedules = savedSchedules.filter(s => s.id !== scheduleId);
    setSavedSchedules(updatedSchedules);
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
    toast.success('Schedule deleted successfully');
  };

  const getTodaySchedules = () => {
    const today = new Date().toISOString().split('T')[0];
    return savedSchedules.filter(s => s.date === today);
  };

  const getUpcomingSchedules = () => {
    const today = new Date().toISOString().split('T')[0];
    return savedSchedules.filter(s => s.date > today).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Source Data for Pie Chart
  const sourceData = [
    { name: 'Website', value: 35, color: '#6366f1' },
    { name: 'Referral', value: 25, color: '#8b5cf6' },
    { name: 'Social Media', value: 20, color: '#ec4899' },
    { name: 'Email', value: 15, color: '#06b6d4' },
    { name: 'Other', value: 5, color: '#f59e0b' }
  ];

  // Monthly Trends Data
  const monthlyData = [
    { month: 'Jan', leads: 12, converted: 2 },
    { month: 'Feb', leads: 15, converted: 3 },
    { month: 'Mar', leads: 18, converted: 4 },
    { month: 'Apr', leads: 22, converted: 5 },
    { month: 'May', leads: 28, converted: 7 },
    { month: 'Jun', leads: 32, converted: 8 }
  ];

  const statCards = [
    { title: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'from-indigo-500 to-purple-600', delay: 0, change: '+12%' },
    { title: 'New Leads', value: stats.newLeads, icon: UserPlus, color: 'from-emerald-500 to-teal-600', delay: 0.1, change: '+5%' },
    { title: 'Contacted', value: stats.contactedLeads, icon: PhoneCall, color: 'from-blue-500 to-cyan-600', delay: 0.2, change: '+8%' },
    { title: 'Converted', value: stats.convertedLeads, icon: Trophy, color: 'from-amber-500 to-orange-600', delay: 0.3, change: '+15%' }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'new': return <AlertCircle className="w-4 h-4 text-emerald-500" />;
      case 'contacted': return <Mail className="w-4 h-4 text-blue-500" />;
      case 'converted': return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'new': return 'badge-new';
      case 'contacted': return 'badge-contacted';
      case 'converted': return 'badge-converted';
      default: return 'badge-default';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-fade-in-up">
          <div className="skeleton h-8 w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-32 rounded-2xl"></div>)}
          </div>
          <div className="mt-6">
            <div className="skeleton h-32 rounded-2xl"></div>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-96 rounded-2xl"></div>
            <div className="skeleton h-96 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        {/* Header with Buttons - Order: Refresh, Export, Logout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold gradient-text-primary">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your CRM overview</p>
          </motion.div>
          
          <div className="flex gap-3">
            {/* Refresh Button - First */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-gradient-primary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin-slow' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            
            {/* Export Button - Second */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={handleExport}
              className="btn-outline-modern flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
            
            {/* Logout Button - Third (Last) */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{ scale: 1.02 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-500">{card.change}</span>
                  <ArrowUp className="w-3 h-3 text-green-500" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 card-modern p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button 
              onClick={handleAddLead}
              className="glass-modern p-4 rounded-xl text-center hover:scale-105 transition"
            >
              <UserPlus className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Add Lead</p>
            </button>
            <button 
              onClick={handleSendEmail}
              className="glass-modern p-4 rounded-xl text-center hover:scale-105 transition"
            >
              <Mail className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Send Email</p>
            </button>
            <button 
              onClick={handleSchedule}
              className="glass-modern p-4 rounded-xl text-center hover:scale-105 transition"
            >
              <Calendar className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Schedule</p>
            </button>
          </div>
        </motion.div>

        {/* Upcoming Schedules Section */}
        {savedSchedules.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-6 card-modern p-6"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              Upcoming Schedules
            </h3>
            
            {/* Today's Schedules */}
            {getTodaySchedules().length > 0 && (
              <div className="mb-4">
                <h4 className="text-md font-semibold text-orange-600 mb-2">Today's Schedule</h4>
                {getTodaySchedules().map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg mb-2">
                    <div>
                      <p className="font-semibold">{schedule.title}</p>
                      <p className="text-sm text-gray-600">Time: {schedule.time}</p>
                      {schedule.description && <p className="text-xs text-gray-500">{schedule.description}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upcoming Schedules */}
            {getUpcomingSchedules().length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-purple-600 mb-2">Upcoming</h4>
                {getUpcomingSchedules().map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <div>
                      <p className="font-semibold">{schedule.title}</p>
                      <p className="text-sm text-gray-600">Date: {schedule.date} | Time: {schedule.time}</p>
                      {schedule.description && <p className="text-xs text-gray-500">{schedule.description}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Source Analysis & Monthly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Leads by Source - Pie Chart */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card-modern p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-700">Leads by Source</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Trends - Area Chart */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="card-modern p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-700">Monthly Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Total Leads" />
                <Area type="monotone" dataKey="converted" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Converted" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-500 mt-2">Lead acquisition and conversion trends over time</p>
          </motion.div>
        </div>

        {/* Recent Leads Activity */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 card-modern p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Recent Leads Activity
            </h3>
            <button 
              onClick={() => navigate('/leads')}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View All →
            </button>
          </div>
          
          {recentLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No leads yet. Add your first lead!</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead, idx) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      lead.status === 'new' ? 'from-emerald-500 to-teal-500' :
                      lead.status === 'contacted' ? 'from-blue-500 to-cyan-500' :
                      'from-purple-500 to-pink-500'
                    }`}>
                      {getStatusIcon(lead.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleScheduleForLead(lead)}
                      className="text-gray-400 hover:text-pink-500 transition"
                      title="Schedule meeting"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <span className={getStatusBadgeClass(lead.status)}>
                      {lead.status}
                    </span>
                    <button
                      onClick={() => handleViewLead(lead.id)}
                      className="text-gray-400 hover:text-purple-600 transition"
                      title="View lead details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-pink-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedLeadForSchedule ? 'Schedule Meeting' : 'Create Schedule'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedLeadForSchedule && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600">
                    Scheduling for: <span className="font-semibold">{selectedLeadForSchedule.name}</span>
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={scheduleData.title}
                  onChange={handleScheduleInputChange}
                  placeholder="e.g., Follow up call, Meeting with client"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={scheduleData.date}
                    onChange={handleScheduleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={scheduleData.time}
                    onChange={handleScheduleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={scheduleData.description}
                  onChange={handleScheduleInputChange}
                  rows="3"
                  placeholder="Add details about this schedule..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Schedule
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lead Details Modal */}
      {showLeadDetailsModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Lead Details</h2>
                </div>
                <button
                  onClick={() => setShowLeadDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Header with Status */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    selectedLead.status === 'new' ? 'from-emerald-500 to-teal-500' :
                    selectedLead.status === 'contacted' ? 'from-blue-500 to-cyan-500' :
                    'from-purple-500 to-pink-500'
                  }`}>
                    {getStatusIcon(selectedLead.status)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedLead.name}</h3>
                    <p className="text-gray-500">Lead ID: {selectedLead.id}</p>
                  </div>
                </div>
                <span className={getStatusBadgeClass(selectedLead.status)}>
                  {selectedLead.status}
                </span>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-purple-500" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-800 font-medium">{selectedLead.email}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800 font-medium">{selectedLead.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Lead Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  Lead Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Source</p>
                    <p className="text-gray-800 font-medium">{selectedLead.source || 'Not specified'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(selectedLead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Notes/Description */}
              {selectedLead.notes && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Notes</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedLead.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowLeadDetailsModal(false);
                    handleScheduleForLead(selectedLead);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </button>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedLead.email}`;
                    toast.success('Opening email client...');
                  }}
                  className="flex-1 px-4 py-2 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button
                  onClick={() => {
                    setShowLeadDetailsModal(false);
                    navigate('/leads');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View All Leads
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
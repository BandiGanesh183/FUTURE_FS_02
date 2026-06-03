import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Video, Briefcase, Plus, Edit2, Trash2, Eye, X, Save, Search, Filter, CheckCircle, Calendar as CalendarIcon, Users, Bell, ChevronRight, Star, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Schedule = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingEvent, setEditingEvent] = useState(null);
  const [animateItems, setAnimateItems] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'meeting',
    location: '',
    description: '',
    attendees: '',
    status: 'upcoming'
  });

  // Trigger animations on mount
  useEffect(() => {
    setTimeout(() => setAnimateItems(true), 100);
  }, []);

  // Sample schedule data
  const [upcomingEvents, setUpcomingEvents] = useState([
    { 
      id: 1, 
      title: " Meeting", 
      date: "2026-05-28",
      time: "10:00 AM", 
      type: "meeting", 
      location: "Conference Room A",
      description: "Discuss Q1 goals and project timeline. Key points: budget approval, resource allocation, and milestone setting.",
      attendees: "Rishikesh, Manoj , Rahul",
      status: "upcoming",
      createdBy: "Admin",
      priority: "High",
      createdAt: "2026-05-25"
    },
    { 
      id: 2, 
      title: "Product Demo", 
      date: "2026-05-28",
      time: "11:30 AM", 
      type: "demo", 
      location: "Virtual (Zoom)",
      description: "Demo new features to potential clients including AI-powered analytics and automated reporting.",
      attendees: "Marketing Team, Sales Team, Technical Lead",
      status: "upcoming",
      createdBy: "Admin",
      priority: "Medium",
      createdAt: "2026-05-26"
    },
    
    { 
      id: 4, 
      title: "Lead Follow-up", 
      date: "2026-05-29",
      time: "3:30 PM", 
      type: "call", 
      location: "Phone Call",
      description: "Follow up on product interest and schedule a detailed demo session.",
      attendees: "Rishikesh, Manoj",
      status: "completed",
      createdBy: "Admin",
      priority: "Low",
      createdAt: "2026-05-27"
    },
    { 
      id: 5, 
      title: "Weekly Review", 
      date: "2026-05-30",
      time: "5:00 PM", 
      type: "review", 
      location: "Virtual (Teams)",
      description: "Team performance review, project status updates, and next week planning.",
      attendees: "All Team Members",
      status: "upcoming",
      createdBy: "Admin",
      priority: "Medium",
      createdAt: "2026-05-28"
    },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'upcoming': return '🟡';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '●';
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      meeting: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      demo: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      call: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      review: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
    };
    return badges[type] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'meeting': return <Briefcase className="w-3 h-3" />;
      case 'demo': return <Video className="w-3 h-3" />;
      case 'call': return <Phone className="w-3 h-3" />;
      case 'review': return <Star className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter and search logic
  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.attendees?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    all: upcomingEvents.length,
    upcoming: upcomingEvents.filter(e => e.status === 'upcoming').length,
    completed: upcomingEvents.filter(e => e.status === 'completed').length,
    cancelled: upcomingEvents.filter(e => e.status === 'cancelled').length
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error('Please fill in title, date, and time');
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      status: 'upcoming',
      createdBy: 'Admin',
      priority: 'Medium',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUpcomingEvents([event, ...upcomingEvents]);
    toast.success('Event added successfully!', {
      icon: '🎉',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
    setShowAddForm(false);
    setNewEvent({ 
      title: '', 
      date: '',
      time: '', 
      type: 'meeting', 
      location: '',
      description: '',
      attendees: '',
      status: 'upcoming'
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    const updatedEvents = upcomingEvents.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    );
    setUpcomingEvents(updatedEvents);
    toast.success('Event updated successfully!', {
      icon: '✏️',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
    setShowEditForm(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Delete this event?</p>
        <p className="text-xs text-gray-400">This action cannot be undone.</p>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              const updatedEvents = upcomingEvents.filter(event => event.id !== id);
              setUpcomingEvents(updatedEvents);
              toast.success('Event deleted successfully!', {
                icon: '🗑️',
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
              });
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-all transform hover:scale-105"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-all transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: '#363636',
        color: '#fff',
        borderRadius: '12px',
      },
    });
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleCompleteEvent = (id) => {
    const updatedEvents = upcomingEvents.map(event => 
      event.id === id ? { ...event, status: 'completed' } : event
    );
    setUpcomingEvents(updatedEvents);
    toast.success('Event marked as completed! 🎯', {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Animation */}
      <div className={`transform transition-all duration-700 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                               📆Schedule Manager
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Manage your meetings and appointments
            </p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 transform group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Stats Cards with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: stats.all, icon: Calendar, color: 'from-blue-500 to-cyan-500', delay: 0 },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'from-yellow-500 to-orange-500', delay: 100 },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500', delay: 200 },
          { label: 'Cancelled', value: stats.cancelled, icon: X, color: 'from-red-500 to-pink-500', delay: 300 },
        ].map((stat, idx) => (
          <div 
            key={idx}
            className={`transform transition-all duration-500 hover:scale-105 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${stat.delay}ms` }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs with Slide Animation */}
      <div className={`transform transition-all duration-700 delay-400 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-100'}`}>
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'all', label: 'All Events', count: stats.all, color: 'indigo' },
            { id: 'upcoming', label: 'Upcoming', count: stats.upcoming, color: 'yellow' },
            { id: 'completed', label: 'Completed', count: stats.completed, color: 'green' },
            { id: 'cancelled', label: 'Cancelled', count: stats.cancelled, color: 'red' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 relative group ${
                filterStatus === tab.id 
                  ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600` 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  filterStatus === tab.id 
                    ? `bg-${tab.color}-100 text-${tab.color}-600` 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </span>
              {filterStatus === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 animate-slide-in"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className={`transform transition-all duration-700 delay-500 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-pulse" />
          <input
            type="text"
            placeholder="Search events by title, location, or attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Schedule Table */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform transition-all duration-700 delay-600 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">No events found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event, index) => (
                  <tr 
                    key={event.id} 
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all duration-300 cursor-pointer group"
                    onMouseEnter={() => setHoveredRow(event.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getTypeBadge(event.type).split(' ')[1]} rounded-lg flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110 duration-300`}>
                            {getTypeIcon(event.type)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                          {event.attendees && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Users className="w-3 h-3" />
                              <span>{event.attendees.split(',').slice(0, 2).join(',')}{event.attendees.split(',').length > 2 ? '...' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{event.date}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getTypeBadge(event.type)} transform transition-all hover:scale-105`}>
                        {getTypeIcon(event.type)}
                        <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[150px]">{event.location || 'Not specified'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)} animate-pulse-slow`}>
                        <span>{getStatusIcon(event.status)}</span>
                        <span className="capitalize">{event.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 transform"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 hover:scale-110 transform"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 transform"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {event.status === 'upcoming' && (
                          <button
                            onClick={() => handleCompleteEvent(event.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 hover:scale-110 transform"
                            title="Mark Complete"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals remain the same but with animation classes */}
      {/* Add Event Modal with Animation */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Schedule New Meeting
              </h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 transition-transform hover:rotate-90 duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Meeting title *"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <input 
                type="date" 
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <input 
                type="time" 
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <select 
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="meeting">Meeting</option>
                <option value="demo">Demo</option>
                <option value="call">Call</option>
                <option value="review">Review</option>
              </select>
              <input 
                type="text" 
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <input 
                type="text" 
                placeholder="Attendees (comma separated)"
                value={newEvent.attendees}
                onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <textarea 
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="col-span-1 md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                rows="3"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleAddEvent}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                Add Event
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Similar animations for Edit and View Modals... */}
      {showEditForm && editingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Edit Event
              </h3>
              <button onClick={() => setShowEditForm(false)} className="text-gray-400 hover:text-gray-600 transition-transform hover:rotate-90 duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="date" 
                value={editingEvent.date}
                onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="time" 
                value={editingEvent.time}
                onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select 
                value={editingEvent.type}
                onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="meeting">Meeting</option>
                <option value="demo">Demo</option>
                <option value="call">Call</option>
                <option value="review">Review</option>
              </select>
              <input 
                type="text" 
                value={editingEvent.location}
                onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="text" 
                value={editingEvent.attendees}
                onChange={(e) => setEditingEvent({...editingEvent, attendees: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea 
                value={editingEvent.description}
                onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                className="col-span-1 md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setShowEditForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getTypeBadge(selectedEvent.type).split(' ')[1]} rounded-xl flex items-center justify-center shadow-lg`}>
                  {getTypeIcon(selectedEvent.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-500">Event ID: #{selectedEvent.id}</p>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 transition-transform hover:rotate-90 duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date & Time
                  </label>
                  <p className="text-gray-800 mt-1 font-medium">{selectedEvent.date} at {selectedEvent.time}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Type</label>
                  <p className="text-gray-800 mt-1 capitalize">{selectedEvent.type}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Status</label>
                  <p className="text-gray-800 mt-1 capitalize">{selectedEvent.status}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Priority</label>
                  <p className="text-gray-800 mt-1">{selectedEvent.priority}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <p className="text-gray-800 mt-1">{selectedEvent.location || 'Not specified'}</p>
                </div>
              </div>
              {selectedEvent.attendees && (
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3" /> Attendees
                  </label>
                  <p className="text-gray-800 mt-1">{selectedEvent.attendees}</p>
                </div>
              )}
              {selectedEvent.description && (
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                  <p className="text-gray-800 mt-1 bg-gray-50 p-3 rounded-lg">{selectedEvent.description}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Created By</label>
                  <p className="text-gray-800 mt-1">{selectedEvent.createdBy}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Created At</label>
                  <p className="text-gray-800 mt-1">{selectedEvent.createdAt}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditEvent(selectedEvent);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Edit Event
              </button>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  handleDeleteEvent(selectedEvent.id);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
      `}</style>
    </div>
  );
};

export default Schedule;

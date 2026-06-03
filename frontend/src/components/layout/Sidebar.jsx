import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu, X, Sun, Moon, ChevronRight, Edit2, Check, Sparkles, Calendar } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [hoveredItem, setHoveredItem] = useState(null);
  const [rippleEffect, setRippleEffect] = useState({ show: false, x: 0, y: 0 });

  // Trigger animation for menu items when sidebar opens
  useEffect(() => {
    if (isSidebarOpen) {
      setTimeout(() => setAnimateItems(true), 150);
    } else {
      setAnimateItems(false);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'enabled');
      toast.success('Dark mode enabled', {
        icon: '🌙',
        duration: 1500,
      });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'disabled');
      toast.success('Light mode enabled', {
        icon: '☀️',
        duration: 1500,
      });
    }
  };

  // Fixed logout function
  const handleLogout = () => {
    // Add button press animation
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (logoutBtn) logoutBtn.style.transform = 'scale(1)';
      }, 200);
    }
    
    // Clear storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Show success message
    toast.success('Logged out successfully!', {
      icon: '👋',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    
    // Navigate to login
    navigate("/login");
  };

  // Handle ripple effect on click
  const handleRippleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRippleEffect({ show: true, x, y });
    setTimeout(() => setRippleEffect({ show: false, x: 0, y: 0 }), 600);
  };

  // Combined handler for logout with ripple effect
  const handleLogoutClick = (e) => {
    handleRippleClick(e);
    setTimeout(() => {
      handleLogout();
    }, 150);
  };

  // Edit name functions
  const handleEditName = () => {
    setEditName(user?.name || user?.username || '');
    setIsEditing(true);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      const updatedUser = { 
        ...user, 
        name: editName.trim(),
        username: editName.trim()
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Name updated successfully!', {
        icon: '✨',
        duration: 2000,
      });
      setIsEditing(false);
    } else {
      toast.error('Name cannot be empty!');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName('');
  };

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard, color: "from-blue-500 to-cyan-500" },
    { path: "/leads", name: "Leads", icon: Users, color: "from-green-500 to-emerald-500" },
    { path: "/schedule", name: "Schedule", icon: Calendar, color: "from-orange-500 to-red-500" },
  ];

  const isActive = (path) => location.pathname === path;

  // Close sidebar on escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
        }`}
      >
        <Menu className={`w-5 h-5 transition-all duration-300 ${isSidebarOpen ? 'rotate-90 scale-110' : 'rotate-0 group-hover:rotate-12'}`} />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-2xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.68, -0.55, 0.265, 1.55)] z-50
          ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'}
          ${isDarkMode ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`relative overflow-hidden flex items-center justify-between p-5 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-100'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md animate-float">
              <Sparkles className="w-5 h-5 text-white animate-pulse-once" />
            </div>
            <div className="animate-slide-in-right">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent bg-300% animate-gradient">
                Ganesh CRM
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Lead Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`p-2 rounded-lg transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95 ${
              isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`p-5 mx-3 mt-4 rounded-2xl transition-all duration-500 delay-100 transform ${animateItems ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} relative overflow-hidden group ${
          isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-indigo-50 to-purple-50'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md animate-bounce-in">
                <span className="text-white font-bold text-xl">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'G'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse-slow"></div>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2 animate-slide-down">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 focus:scale-105 ${
                      isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-purple-300 bg-white text-gray-800'
                    }`}
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Check className="w-3 h-3 animate-spin-once" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold transition-all duration-300 hover:translate-x-1 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {user?.name || user?.username || 'Ganesh'}
                    </p>
                    <button
                      onClick={handleEditName}
                      className={`p-1 rounded-full transition-all duration-300 hover:rotate-12 hover:scale-110 ${
                        isDarkMode ? 'text-gray-400 hover:text-purple-400 hover:bg-purple-900/30' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-100'
                      }`}
                      title="Edit name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className={`text-xs animate-fade-in-up ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.email || 'ganesh@crm.com'}
                  </p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full animate-pulse-slow ${
                    isDarkMode ? 'text-purple-400 bg-purple-900/30' : 'text-purple-600 bg-purple-100'
                  }`}>
                    {user?.role || 'Admin'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 transform overflow-hidden ${
                  active 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                } ${animateItems ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                {rippleEffect.show && (
                  <span
                    className="absolute w-32 h-32 bg-white/30 rounded-full pointer-events-none animate-ripple"
                    style={{ left: rippleEffect.x - 64, top: rippleEffect.y - 64 }}
                  />
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-5 h-5 transition-all duration-300 ${hoveredItem === index ? 'scale-110 rotate-12' : ''} ${active ? 'text-white' : 'group-hover:scale-110'}`} />
                  <span className="font-medium transition-all duration-300 group-hover:translate-x-1">{item.name}</span>
                </div>
                
                <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                  active 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
                }`} />
                
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-slide-in-left"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`p-4 border-t space-y-2 transition-all duration-500 delay-300 transform ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${
          isDarkMode ? 'border-gray-800' : 'border-gray-100'
        }`}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group ${
              isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-500 transition-all duration-500 rotate-0 group-hover:rotate-90" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500 transition-all duration-500 group-hover:rotate-12" />
                )}
              </div>
              <span className="text-sm">Dark Mode</span>
            </div>
            <div className="relative">
              <div className={`w-10 h-5 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </button>

          {/* Logout Button */}
          <button
            id="logout-btn"
            onClick={handleLogoutClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group relative overflow-hidden ${
              isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isDarkMode ? 'from-red-900/10' : ''
            }`}></div>
            <LogOut className="w-4 h-4 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 group-hover:animate-shake" />
            <span className="font-medium relative z-10">Logout</span>
          </button>

          {/* User Info Footer */}
          <div className="px-4 pt-4 animate-fade-in-up">
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Logged in as</p>
            <p className={`text-sm font-medium truncate transition-all duration-300 hover:translate-x-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {user?.username || user?.email || 'ganesh'}
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes pulse-once {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }
        
        @keyframes spin-once {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.4s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-pulse-once { animation: pulse-once 0.5s ease-in-out; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
        .animate-ripple { animation: ripple 0.6s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-spin-once { animation: spin-once 0.5s ease-out; }
        
        .bg-300\% { background-size: 300%; }
      `}</style>
    </>
  );
};

export default Sidebar;
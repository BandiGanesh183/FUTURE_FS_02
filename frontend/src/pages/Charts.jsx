import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, PieChart, TrendingUp, Users, 
  UserPlus, PhoneCall, Trophy, ArrowUp 
} from 'lucide-react';
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Charts = () => {
  // Sample data
  const monthlyData = [
    { month: 'Jan', leads: 12, converted: 2 },
    { month: 'Feb', leads: 15, converted: 3 },
    { month: 'Mar', leads: 18, converted: 4 },
    { month: 'Apr', leads: 22, converted: 5 },
    { month: 'May', leads: 28, converted: 7 },
    { month: 'Jun', leads: 32, converted: 8 },
  ];

  const sourceData = [
    { name: 'Website', value: 35, color: '#6366f1' },
    { name: 'Referral', value: 25, color: '#8b5cf6' },
    { name: 'Social Media', value: 20, color: '#ec4899' },
    { name: 'Email', value: 15, color: '#06b6d4' },
    { name: 'Other', value: 5, color: '#f59e0b' },
  ];

  const statusData = [
    { name: 'New', value: 40, color: '#10b981' },
    { name: 'Contacted', value: 35, color: '#3b82f6' },
    { name: 'Converted', value: 25, color: '#8b5cf6' },
  ];

  const stats = [
    { title: 'Total Leads', value: 45, icon: Users, change: '+12%', color: 'from-indigo-500 to-purple-600' },
    { title: 'New Leads', value: 18, icon: UserPlus, change: '+5%', color: 'from-emerald-500 to-teal-600' },
    { title: 'Contacted', value: 15, icon: PhoneCall, change: '+8%', color: 'from-blue-500 to-cyan-600' },
    { title: 'Converted', value: 12, icon: Trophy, change: '+15%', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text-primary">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View your lead analytics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm">{stat.change}</span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Monthly Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} name="Total Leads" />
              <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} name="Converted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Lead Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Leads by Source</h3>
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
        </div>

        {/* Bar Chart - Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Lead Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart - Cumulative Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <AreaChart className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Cumulative Growth</h3>
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
        </div>
      </div>
    </motion.div>
  );
};

export default Charts;
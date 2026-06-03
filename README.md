# 🚀 Ganesh CRM Lead Management System - Professional Lead Management Platform

A production-grade Customer Relationship Management system architected for comprehensive lead tracking, intelligent sales pipeline management, and data-driven conversion optimization. Purpose-built for agencies, freelancers, and scaling startups.

Dashboard | Leads Management | Analytics Pipeline

## ✨ Features

### 🎯 Core Lead Management
- ✅ **Complete CRUD Operations** - Create, read, update, and delete leads
- ✅ **Lead Status Tracking** - Visual pipeline (New → Contacted → Qualified → Negotiation → Won → Lost)
- ✅ **Lead Scoring System** - Auto-calculated 0-100 quality score based on engagement
- ✅ **Source Tracking** - Track leads from Website, Referral, Social Media, Email Campaigns
- ✅ **Tag System** - Categorize leads as "hot" 🔥, "vip" 👑, "enterprise" 🏢

### 📊 Analytics & Reporting
- 📈 **Conversion Rate Dashboard** - Track lead-to-customer conversion metrics
- 📉 **Monthly Trend Charts** - Monitor leads and conversions over time
- 🎯 **Lead Distribution Chart** - Visual breakdown by status (Donut chart)
- 🔍 **Lead Source Analytics** - Know exactly where your best leads come from
- ⏱️ **Response Time Tracking** - Measure team efficiency and response metrics
- 📊 **Pipeline Velocity** - Track how fast leads move through stages

### 💬 Communication Tools
- 📧 **Email Integration** - Send emails directly with templates
- 💬 **WhatsApp Integration** - One-click WhatsApp messages
- 📝 **Notes & Activity Logging** - Track calls, emails, meetings, and follow-ups
- 📅 **Follow-up Reminders** - Never miss a follow-up opportunity
- 🗓️ **Interaction History** - Complete timeline for each lead

### 🏷️ Advanced Lead Management
- 🏷️ **Smart Tagging** - Add custom tags like "hot", "vip", "enterprise", "long-term"
- 🎯 **Lead Quality Scores** - Score badges (Hot 🔥 70+, Warm 🟡 40-69, Cold ❄️ 0-39)
- 📦 **Bulk Actions** - Update status, add tags, delete multiple leads at once
- 🔎 **Advanced Search & Filter** - Search by name/email, filter by status/tags/source
- 📄 **Export to CSV/Excel** - Download lead data for offline analysis
- 📋 **Import from CSV** - Bulk upload leads from spreadsheets

### 👥 Team Management
- 👥 **Multi-User Support** - Create multiple admin, manager, and viewer accounts
- 🔐 **Role-Based Access Control (RBAC)** - Granular permissions for each role
- 👑 **Admin Panel** - Complete user management interface
- 📊 **Team Performance Tracking** - Monitor individual and team metrics
- 📝 **Activity Logging** - Complete audit trail of all user actions

### 🎨 UI/UX Excellence
- 🌙 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- 📱 **Fully Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔔 **Real-time Notifications** - Instant updates on lead changes
- ⚡ **Keyboard Shortcuts** - Power user productivity boosters
- 🐛 **Debug Panel** - Built-in debugging tools for developers
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

### Pipeline Management
- 🎯 **Visual Sales Pipeline** - Kanban board view for drag-and-drop status updates
- 📊 **Conversion Funnel** - Visual lead progression through each stage
- 💰 **Expected Revenue Tracking** - Track potential revenue from pipeline
- 📈 **Stage Analytics** - Conversion rates between each pipeline stage

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2 | UI Framework |
| Tailwind CSS | 3.3 | Styling & Design |
| Chart.js | 4.4 | Analytics & Charts |
| Axios | 1.6 | API Calls |
| React Router | 6.20 | Navigation |
| Lucide React | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime Environment |
| Express.js | 4.18 | API Framework |
| MySQL | 8.0 | Database |
| Sequelize | 6.35 | ORM |
| JWT | 9.0 | Authentication |
| bcryptjs | 2.4 | Password Hashing |


## 🚀 How to Run (Step-by-Step)

### Terminal 1 - Backend Server
bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies (first time only)
npm install

# 3. Create .env file (first time only)
cat > .env << EOL
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crm_database
JWT_SECRET=your_secret_key
EOL

# 4. Start backend server
npm run dev

#🚀 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies (first time only)
npm install

# 3. Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# 4. Start frontend development server
npm start

# ✅ Frontend will run on: http://localhost:3000
# ✅ The browser will open automatically

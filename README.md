
## 🎯 Project Overview

A complete store rating platform with three user roles:
- **System Administrator** - Manage users, stores, and view analytics
- **Normal User** - Register, browse stores, and submit ratings
- **Store Owner** - Manage own stores and view ratings

### Key Features
✅ User registration and login with JWT authentication  
✅ Role-based access control (RBAC)  
✅ Store browsing, searching, and rating system  
✅ Admin dashboard with statistics  
✅ Store owner dashboard with rating analytics  
✅ Password hashing and security  
✅ Email validation and input sanitization  

## � Quick Login Credentials

### Admin Account
```
Email: admin@example.com
Password: Password@123
Role: System Administrator
```


---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **API:** REST with JSON

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS
- **HTTP Client:** Fetch API / Axios
- **State Management:** React Context API

---

## 📁 Project Structure

```
project/
├── Backend/                          # Express.js server
│   ├── config/
│   │   └── auth.js                  # JWT configuration
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── userController.js
│   │   └── storeOwnerController.js
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & role checking
│   ├── routes/                      # API endpoints
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── user.js
│   │   └── storeOwner.js
│   ├── helpers/
│   │   └── validation.js            # Input validation
│   ├── utils/
│   │   ├── db.js                    # Database connection
│   │   └── result.js
│   ├── server.js                    # Main server file
│   ├── package.json
│   ├── db.sql                       # Database schema
│   ├── API_DOCUMENTATION.md
│   ├── QUICK_START.md
│   ├── SETUP.md
│   ├── README.md
│   └── postman_collection.json      # Postman testing
│
└── Frontend/Store/                  # React + Vite application
    ├── src/
    │   ├── components/              # Reusable components
    │   │   ├── Header.jsx
    │   │   └── ChangePasswordModal.jsx
    │   ├── pages/                   # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── UserDashboard.jsx
    │   │   └── StoreOwnerDashboard.jsx
    │   ├── services/                # API service calls
    │   │   ├── authService.js
    │   │   ├── adminService.js
    │   │   ├── userService.js
    │   │   └── storeOwnerService.js
    │   ├── context/                 # React Context
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── App.css
    │   └── index.css
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    └── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ installed
- MySQL server running
- npm package manager
- Git (optional)

### Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start the server
node server.js

# Server runs on: http://localhost:4000
```

### Frontend Setup (5 minutes)

```bash
# Navigate to frontend directory
cd Frontend/Store

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on: http://localhost:5173 (or next available port)
```

---



### 4. Dependencies

Key packages installed:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `jsonwebtoken` - JWT authentication
- `mysql2` - MySQL driver
- `bcryptjs` - Password hashing

---

## 🎨 Frontend Setup (Detailed)

### 1. Installation

```bash
cd Frontend/Store
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

This starts Vite dev server with HMR (Hot Module Replacement).

### 3. Build for Production

```bash
npm run build
```

Output goes to `dist/` directory.

### 4. Environment Configuration

Create `Frontend/Store/.env` if needed:

```
VITE_API_URL=http://localhost:4000/api
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:4000/api
```


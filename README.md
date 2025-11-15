# Loan Origination & Approval System

A full-stack web application for managing loan applications with automatic eligibility evaluation, built with **Node.js**, **Express**, **MongoDB**, and **React**.

> 📚 **New here?** Check the [Documentation Index](DOCUMENTATION_INDEX.md) for a complete guide to all documentation files, or jump to [Quick Start](QUICKSTART.md) for 5-minute setup!

## 🎯 Project Overview

This system allows customers to apply for loans and enables loan officers to review and process applications. The platform includes:

- **Customer Portal**: Apply for loans, track application status
- **Officer Dashboard**: Review pending applications, approve/reject loans
- **Automatic Eligibility Scoring**: AI-based loan evaluation system
- **JWT Authentication**: Secure role-based access control
- **Real-time Updates**: Toast notifications for all actions

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Modular Design**: Separate modules for Auth, Customer, Loan, and Officer
- **MongoDB with Mongoose**: Relational data modeling with references
- **JWT Authentication**: Secure token-based authentication
- **Automatic Loan Evaluation**: Eligibility scoring based on income, credit score, and loan amount

### Frontend (React)
- **React Router**: Client-side routing
- **Context API**: Global state management for authentication
- **Axios**: HTTP client with interceptors for JWT tokens
- **React Toastify**: Beautiful toast notifications
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
Loan Assignment/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── customer.controller.js
│   │   ├── loan.controller.js
│   │   └── officer.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Customer.model.js
│   │   ├── LoanOfficer.model.js
│   │   └── LoanApplication.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── customer.routes.js
│   │   ├── loan.routes.js
│   │   └── officer.routes.js
│   ├── services/
│   │   └── loan.service.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Loader.js
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── ApplyLoan.js
    │   │   ├── CustomerDashboard.js
    │   │   ├── Login.js
    │   │   ├── MyLoans.js
    │   │   ├── OfficerDashboard.js
    │   │   ├── PendingLoans.js
    │   │   └── Register.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env
    ├── .gitignore
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/loan_origination
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. Start MongoDB:
   ```bash
   # Windows (if MongoDB is installed as a service)
   net start MongoDB

   # Or use MongoDB Compass and start local connection
   ```

5. Run the backend server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # OR Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

   Application will open on `http://localhost:3000`

## 📊 Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  role: Enum ['CUSTOMER', 'OFFICER'] (required),
  timestamps: true
}
```

### Customer
```javascript
{
  userId: ObjectId (ref: 'User'),
  income: Number,
  creditScore: Number (300-850),
  timestamps: true
}
```

### LoanOfficer
```javascript
{
  userId: ObjectId (ref: 'User'),
  branch: String,
  timestamps: true
}
```

### LoanApplication
```javascript
{
  customerId: ObjectId (ref: 'Customer'),
  officerId: ObjectId (ref: 'LoanOfficer'),
  amountRequested: Number (required),
  tenureMonths: Number (required),
  interestRate: Number,
  status: Enum ['PENDING', 'APPROVED', 'REJECTED'],
  eligibilityScore: Number (0-1),
  rejectionReason: String,
  timestamps: true
}
```

## 🔐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER",
  "income": 500000,
  "creditScore": 750
}

Response: 201 Created
{
  "message": "User registered successfully",
  "userId": "64abc123...",
  "role": "CUSTOMER"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "64abc123...",
  "role": "CUSTOMER",
  "name": "John Doe",
  "email": "john@example.com",
  "roleSpecificId": "64def456..."
}
```

#### Get Current User Profile
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "user": { ... },
  "customerDetails": { ... }
}
```

### Loan Endpoints

#### Apply for Loan (Customer Only)
```http
POST /loans/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "64def456...",
  "amountRequested": 500000,
  "tenureMonths": 24
}

Response: 201 Created
{
  "message": "Loan application submitted successfully",
  "loanId": "64xyz789...",
  "status": "APPROVED",
  "eligibilityScore": 0.82,
  "interestRate": 7.9,
  "emi": 22650.50,
  "rejectionReason": null
}
```

#### Get Loan Status
```http
GET /loans/:id/status
Authorization: Bearer <token>

Response: 200 OK
{
  "loanId": "64xyz789...",
  "status": "APPROVED",
  "eligibilityScore": 0.82,
  "amountRequested": 500000,
  "tenureMonths": 24,
  "interestRate": 7.9,
  "emi": 22650.50,
  "customer": { ... },
  "officer": { ... },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:05.000Z"
}
```

#### Get Customer Loans
```http
GET /loans/customer/:customerId
Authorization: Bearer <token>

Response: 200 OK
{
  "count": 3,
  "loans": [ ... ]
}
```

#### Get All Loans (Officer Only)
```http
GET /loans?status=PENDING
Authorization: Bearer <token>

Response: 200 OK
{
  "count": 5,
  "loans": [ ... ]
}
```

### Officer Endpoints

#### Get Pending Loans
```http
GET /officer/loans/pending
Authorization: Bearer <token>

Response: 200 OK
{
  "count": 5,
  "loans": [ ... ]
}
```

#### Review Loan Application
```http
POST /officer/loans/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "APPROVE",
  "comments": "Good credit history and stable income"
}

Response: 200 OK
{
  "message": "Loan application approved successfully",
  "loan": { ... }
}
```

#### Get Loan Statistics
```http
GET /officer/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "totalLoans": 50,
  "pendingLoans": 10,
  "approvedLoans": 35,
  "rejectedLoans": 5,
  "totalApprovedAmount": 15000000
}
```

### Customer Endpoints

#### Get Customer Profile
```http
GET /customer/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "64def456...",
  "userId": { ... },
  "income": 500000,
  "creditScore": 750
}
```

#### Update Customer Profile
```http
PUT /customer/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "income": 600000,
  "creditScore": 780
}

Response: 200 OK
{
  "message": "Profile updated successfully",
  "customer": { ... }
}
```

## 🧮 Loan Evaluation Logic

The system automatically evaluates loan applications using the following algorithm:

### Normalization
```javascript
incomeNorm = (income - 0) / (10,000,000 - 0)
creditScoreNorm = (creditScore - 300) / (850 - 300)
amountNorm = (amountRequested - 1,000) / (10,000,000 - 1,000)
```

### Eligibility Score Calculation
```javascript
eligibilityScore = (0.6 × creditScoreNorm) + (0.4 × incomeNorm) - (0.2 × amountNorm)
normalizedScore = max(0, min(1, eligibilityScore))
```

### Approval Logic
- **Score ≥ 0.5**: APPROVED
  - Interest Rate: 7% - 12% (inversely proportional to score)
- **Score < 0.5**: REJECTED
  - Rejection reasons provided based on:
    - Credit score < 550
    - Annual income < ₹200,000
    - EMI > 50% of monthly income

## 👥 User Roles & Features

### Customer
- ✅ Register and login
- ✅ Update profile (income, credit score)
- ✅ Apply for loans
- ✅ View loan application status
- ✅ Track all loan applications
- ✅ View eligibility scores and EMI calculations

### Loan Officer
- ✅ Register and login
- ✅ View all loan applications
- ✅ Filter by status (Pending/Approved/Rejected)
- ✅ Review pending applications
- ✅ Approve or reject loans with comments
- ✅ View loan statistics and analytics

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-Based Routing**: Different dashboards for customers and officers
- **Protected Routes**: JWT authentication required
- **Toast Notifications**: Real-time feedback for all actions
- **Data Visualization**: Stats cards and tables
- **Filtering**: Filter loans by status
- **Detailed Views**: Expandable rows for loan details

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Role-Based Access Control**: Middleware for route protection
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data in .env files

## 🧪 Testing the Application

### Test Users

You can create test users with the following roles:

**Customer:**
```json
{
  "name": "Test Customer",
  "email": "customer@test.com",
  "password": "password123",
  "role": "CUSTOMER",
  "income": 600000,
  "creditScore": 750
}
```

**Loan Officer:**
```json
{
  "name": "Test Officer",
  "email": "officer@test.com",
  "password": "password123",
  "role": "OFFICER",
  "branch": "Main Branch"
}
```

### Test Scenarios

1. **High Eligibility (Approved)**
   - Income: ₹800,000
   - Credit Score: 780
   - Loan Amount: ₹300,000
   - Tenure: 24 months
   - Expected: APPROVED

2. **Low Eligibility (Rejected)**
   - Income: ₹150,000
   - Credit Score: 450
   - Loan Amount: ₹500,000
   - Tenure: 12 months
   - Expected: REJECTED

3. **Border Case**
   - Income: ₹400,000
   - Credit Score: 600
   - Loan Amount: ₹400,000
   - Tenure: 36 months
   - Expected: Could go either way

## 📝 Development Notes

### Backend Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT implementation
- `dotenv`: Environment variables
- `cors`: CORS middleware
- `express-validator`: Input validation

### Frontend Dependencies
- `react`: UI library
- `react-router-dom`: Routing
- `axios`: HTTP client
- `react-toastify`: Toast notifications

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB service (Windows)
net start MongoDB

# Or use MongoDB Compass
```

### Port Already in Use
```bash
# Backend (Port 5000)
# Change PORT in backend/.env

# Frontend (Port 3000)
# React will automatically suggest port 3001
```

### JWT Token Errors
- Clear localStorage in browser DevTools
- Logout and login again
- Check if JWT_SECRET matches in .env

### CORS Issues
- Ensure backend CORS is configured correctly
- Check REACT_APP_API_URL in frontend/.env

## 🚀 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Set environment variables
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel/Netlify)
```bash
# Build production version
npm run build

# Deploy the build folder
```

## 📄 License

This project is created for educational purposes as part of a Node.js Technical Assignment.

## 👨‍💻 Author

Created as part of Node.js + React Full-Stack Development Assignment

---

**Happy Coding! 🎉**

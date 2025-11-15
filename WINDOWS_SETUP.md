# 🪟 Windows PowerShell Setup Guide

Complete setup instructions for Windows users.

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Choose LTS version (v18 or higher)
- Run installer and follow prompts
- Verify installation:
```powershell
node --version
npm --version
```

### 2. Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Choose Windows version
- Run installer (Complete installation)
- MongoDB will be installed as a Windows service

**OR** use MongoDB Compass (GUI tool):
- Download from: https://www.mongodb.com/try/download/compass
- Install and start a local connection to `mongodb://localhost:27017`

## Project Setup

### Step 1: Navigate to Project Directory
```powershell
cd "d:\Loan Assignment"
```

### Step 2: Backend Setup
```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# This will install:
# - express, mongoose, bcryptjs, jsonwebtoken
# - dotenv, cors, express-validator, nodemon
```

### Step 3: Frontend Setup
```powershell
# Open a NEW PowerShell window
cd "d:\Loan Assignment\frontend"

# Install dependencies
npm install

# This will install:
# - react, react-dom, react-router-dom
# - axios, react-toastify, react-scripts
```

### Step 4: Verify MongoDB is Running
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it:
Start-Service -Name MongoDB

# OR if you get an error, use:
net start MongoDB
```

## Running the Application

### Option 1: Manual Start (Two Windows)

**PowerShell Window 1 - Backend:**
```powershell
cd "d:\Loan Assignment\backend"
npm run dev
```
Wait for "MongoDB connected successfully" and "Server running on port 5000"

**PowerShell Window 2 - Frontend:**
```powershell
cd "d:\Loan Assignment\frontend"
npm start
```
Browser will automatically open to http://localhost:3000

### Option 2: Using PowerShell Script

Create a file `start.ps1` in the project root:
```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Loan Assignment\backend'; npm run dev"

# Wait 5 seconds for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Loan Assignment\frontend'; npm start"
```

Then run:
```powershell
.\start.ps1
```

## Seeding Sample Data (Optional)

To populate the database with test data:

```powershell
cd "d:\Loan Assignment\backend"
npm run seed
```

This creates:
- 4 test customers (rajesh@example.com, priya@example.com, amit@example.com, neha@example.com)
- 2 test officers (suresh@example.com, kavita@example.com)
- 6 sample loan applications
- Password for all: **password123**

## Testing the Application

### 1. Register New User
- Go to http://localhost:3000/register
- Fill in the form
- Choose Customer or Officer role
- Click Register

### 2. Login
- Go to http://localhost:3000/login
- Use your credentials or:
  - Email: rajesh@example.com (if seeded)
  - Password: password123

### 3. Customer Workflow
- View dashboard
- Click "Apply for New Loan"
- Enter amount and tenure
- Submit and see automatic evaluation

### 4. Officer Workflow
- Login as officer (suresh@example.com)
- View pending applications
- Click on application to expand details
- Approve or reject with comments

## Troubleshooting

### MongoDB Connection Failed
```powershell
# Check service status
Get-Service -Name MongoDB

# Restart service
Restart-Service -Name MongoDB

# If service doesn't exist, MongoDB might not be installed as a service
# Use MongoDB Compass instead and start local connection
```

### Port Already in Use (5000 or 3000)
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the actual number)
taskkill /PID <PID> /F

# Or change port in .env files
```

### NPM Install Fails
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### React App Won't Start
```powershell
# Clear React cache
Remove-Item -Recurse -Force node_modules/.cache

# Rebuild
npm start
```

### Cannot Execute Scripts (PowerShell Execution Policy)
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy (Run PowerShell as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or for single session:
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

## Environment Variables

### Backend (.env)
Located at: `d:\Loan Assignment\backend\.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan_origination
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
Located at: `d:\Loan Assignment\frontend\.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Stopping the Application

### Stop Backend
Press `Ctrl + C` in the backend PowerShell window

### Stop Frontend
Press `Ctrl + C` in the frontend PowerShell window

### Stop MongoDB Service (if needed)
```powershell
Stop-Service -Name MongoDB
# OR
net stop MongoDB
```

## Building for Production

### Backend
```powershell
cd "d:\Loan Assignment\backend"
# Set NODE_ENV=production in .env
# Deploy to Heroku, AWS, or Azure
```

### Frontend
```powershell
cd "d:\Loan Assignment\frontend"
npm run build

# Build folder will be created at: d:\Loan Assignment\frontend\build
# Deploy to Vercel, Netlify, or any static hosting
```

## Useful Commands

### Check if Ports are Available
```powershell
# Check port 5000
Test-NetConnection -ComputerName localhost -Port 5000

# Check port 3000
Test-NetConnection -ComputerName localhost -Port 3000
```

### View Running Node Processes
```powershell
Get-Process -Name node
```

### Kill All Node Processes (use with caution)
```powershell
Get-Process -Name node | Stop-Process -Force
```

### Open MongoDB Shell
```powershell
mongosh
# Then:
use loan_origination
db.users.find()
db.loanapplications.find()
```

## Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- MongoDB for VS Code
- Thunder Client (API testing)

### Browser Extensions
- React Developer Tools
- Redux DevTools (if you add Redux later)

## Need Help?

1. Check the main README.md for detailed documentation
2. Check QUICKSTART.md for quick reference
3. Review error messages in PowerShell windows
4. Check browser console (F12) for frontend errors
5. Check MongoDB connection in MongoDB Compass

## Next Steps

✅ Application is running
✅ Test customer registration and login
✅ Apply for a loan as customer
✅ Review loans as officer
✅ Explore the code structure
✅ Add your own features

**Good luck with your project! 🚀**

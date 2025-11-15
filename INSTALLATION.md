# Installation & Verification Guide

## Step-by-Step Installation

### Step 1: Verify Prerequisites ✓

```powershell
# Check Node.js installation
node --version
# Expected: v14.0.0 or higher

# Check npm installation
npm --version
# Expected: 6.0.0 or higher

# Check MongoDB (if installed as service)
sc query MongoDB
# Expected: RUNNING

# Or check MongoDB Compass is installed
```

If any are missing, install from:
- Node.js: https://nodejs.org/
- MongoDB: https://www.mongodb.com/try/download/community
- MongoDB Compass: https://www.mongodb.com/try/download/compass

---

### Step 2: Install Backend Dependencies ✓

```powershell
# Navigate to backend directory
cd "d:\Loan Assignment\backend"

# Install all dependencies
npm install

# Expected packages installed:
# - express
# - mongoose
# - bcryptjs
# - jsonwebtoken
# - dotenv
# - cors
# - express-validator
# - nodemon (dev)

# Verify installation
npm list --depth=0
```

**Expected output:**
```
loan-origination-backend@1.0.0
├── bcryptjs@2.4.3
├── cors@2.8.5
├── dotenv@16.3.1
├── express@4.18.2
├── express-validator@7.0.1
├── jsonwebtoken@9.0.2
├── mongoose@8.0.0
└── nodemon@3.0.1
```

---

### Step 3: Install Frontend Dependencies ✓

```powershell
# Navigate to frontend directory
cd "d:\Loan Assignment\frontend"

# Install all dependencies
npm install

# Expected packages installed:
# - react
# - react-dom
# - react-router-dom
# - axios
# - react-toastify
# - react-scripts

# Verify installation
npm list --depth=0
```

**Expected output:**
```
loan-origination-frontend@0.1.0
├── axios@1.6.2
├── react@18.2.0
├── react-dom@18.2.0
├── react-router-dom@6.20.0
├── react-scripts@5.0.1
└── react-toastify@9.1.3
```

---

### Step 4: Verify Environment Files ✓

**Backend .env:**
```powershell
cd "d:\Loan Assignment\backend"
cat .env
```

Should contain:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan_origination
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend .env:**
```powershell
cd "d:\Loan Assignment\frontend"
cat .env
```

Should contain:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

### Step 5: Start MongoDB ✓

**Option A: Windows Service**
```powershell
# Start MongoDB service
net start MongoDB

# Verify it's running
sc query MongoDB
```

**Option B: MongoDB Compass**
- Open MongoDB Compass
- Connect to: `mongodb://localhost:27017`
- Should see "Connected" status

---

### Step 6: Seed Database (Optional) ✓

```powershell
cd "d:\Loan Assignment\backend"
npm run seed
```

**Expected output:**
```
MongoDB connected successfully
Clearing existing data...
Existing data cleared.
Creating users...
Users created successfully.
Creating loan applications...
Loan applications created successfully.

✅ Database seeded successfully!

📋 Test Accounts (Password for all: password123):

Customers:
1. rajesh@example.com (High eligibility)
2. priya@example.com (Medium eligibility)
3. amit@example.com (Low-Medium eligibility)
4. neha@example.com (Low eligibility)

Officers:
1. suresh@example.com (Mumbai Branch)
2. kavita@example.com (Delhi Branch)
```

---

### Step 7: Start Backend Server ✓

```powershell
cd "d:\Loan Assignment\backend"
npm run dev
```

**Expected output:**
```
[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
MongoDB connected successfully
Server running on port 5000
```

**✅ Backend is ready when you see both messages!**

---

### Step 8: Start Frontend Server ✓

**Open a NEW PowerShell window:**
```powershell
cd "d:\Loan Assignment\frontend"
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view loan-origination-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**✅ Frontend is ready and browser should open automatically!**

---

## Verification Checklist

### Backend Verification ✓

1. **Health Check**
   ```powershell
   curl http://localhost:5000/api/health
   ```
   Expected: `{"status":"OK","message":"Server is running"}`

2. **Test Registration**
   ```powershell
   curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"test123","role":"CUSTOMER"}'
   ```
   Expected: `{"message":"User registered successfully","userId":"...","role":"CUSTOMER"}`

3. **Test Login**
   ```powershell
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123"}'
   ```
   Expected: `{"token":"...","userId":"...","role":"CUSTOMER",...}`

### Frontend Verification ✓

1. **Check Browser Opens**
   - Browser should automatically open to `http://localhost:3000`
   - Should see login page

2. **Check Registration Page**
   - Click "Register here"
   - Should see registration form

3. **Check Login Page**
   - Should see login form with email and password fields

4. **Register Test User**
   - Name: Test Customer
   - Email: customer@test.com
   - Password: password123
   - Role: Customer
   - Income: 500000
   - Credit Score: 700
   - Click "Register"
   - Should see success message and redirect to login

5. **Login**
   - Email: customer@test.com
   - Password: password123
   - Click "Login"
   - Should redirect to dashboard

6. **Check Dashboard**
   - Should see "Welcome, Test Customer!"
   - Should see income and credit score
   - Should see navigation menu

7. **Apply for Loan**
   - Click "Apply for New Loan"
   - Enter: Amount = 500000, Tenure = 24
   - Click "Submit Application"
   - Should see approval/rejection message

8. **View Loans**
   - Click "My Loans"
   - Should see the application just created
   - Should see eligibility score and status

### Database Verification ✓

**Using MongoDB Compass:**
1. Connect to `mongodb://localhost:27017`
2. Select database: `loan_origination`
3. Check collections exist:
   - users
   - customers
   - loanofficers
   - loanapplications

**Using MongoDB Shell:**
```powershell
mongosh
use loan_origination
db.users.find().pretty()
db.customers.find().pretty()
db.loanapplications.find().pretty()
```

---

## Troubleshooting Common Issues

### Issue 1: MongoDB Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```powershell
net start MongoDB
# OR use MongoDB Compass
```

### Issue 2: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# OR change port in backend/.env
```

### Issue 3: Port 3000 Already in Use
```
Something is already running on port 3000
```
**Solution:**
- React will ask: "Would you like to run the app on another port instead?"
- Press Y to use port 3001

### Issue 4: Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```powershell
cd backend
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue 5: CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify backend is running on port 5000
- Check `frontend/.env` has correct API URL
- Restart both servers

### Issue 6: JWT Token Error
```
Error: No token provided
```
**Solution:**
- Logout and login again
- Clear browser localStorage
- Check if token is being sent in headers

---

## Performance Check

### Backend Performance
```powershell
# Check memory usage
Get-Process -Name node | Select-Object -Property Name,CPU,PM

# Expected: PM (Memory) < 200MB
```

### Frontend Performance
```powershell
# Check bundle size
cd frontend
npm run build

# Expected: build/static/js/*.js < 1MB
```

---

## Final Verification

### Complete Flow Test ✓

1. **Customer Registration & Login** ✓
   - Register new customer
   - Login successfully
   - View dashboard

2. **Loan Application** ✓
   - Apply for loan
   - See automatic evaluation
   - Check eligibility score

3. **Officer Registration & Login** ✓
   - Register new officer
   - Login successfully
   - View officer dashboard

4. **Loan Review** ✓
   - See pending applications
   - Review customer details
   - Approve or reject loan

5. **Status Check** ✓
   - Login as customer again
   - View updated loan status
   - See officer comments

---

## Success Criteria

✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ MongoDB connected
✅ Can register users
✅ Can login
✅ Can apply for loans
✅ Loans are evaluated automatically
✅ Officers can review loans
✅ All pages load correctly
✅ No console errors
✅ API calls work
✅ Database is updated

---

## Next Steps After Verification

1. ✅ Explore the code
2. ✅ Test different scenarios
3. ✅ Review loan evaluation logic
4. ✅ Customize the UI
5. ✅ Add new features
6. ✅ Prepare video walkthrough
7. ✅ Document your changes

---

## Quick Restart Commands

**Stop Servers:**
- Press `Ctrl+C` in both terminal windows

**Restart Backend:**
```powershell
cd "d:\Loan Assignment\backend"
npm run dev
```

**Restart Frontend:**
```powershell
cd "d:\Loan Assignment\frontend"
npm start
```

**Restart Both (Using Script):**
```powershell
cd "d:\Loan Assignment"
.\start.bat
# OR
.\start.ps1
```

---

## Installation Complete! 🎉

Your Loan Origination & Approval System is now fully installed and verified!

**Access Points:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

**Test Accounts (if seeded):**
- Customer: rajesh@example.com / password123
- Officer: suresh@example.com / password123

**Have fun testing and developing! 🚀**

# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

Open **two terminal windows** in the project root directory.

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
```

### Step 2: Start MongoDB

Make sure MongoDB is running on your system:
```powershell
# If MongoDB is installed as a service
net start MongoDB

# OR use MongoDB Compass and connect to localhost:27017
```

### Step 3: Start the Servers

**Terminal 1 - Backend:**
```powershell
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
npm start
```
✅ Frontend running on http://localhost:3000

### Step 4: Test the Application

The browser should automatically open to http://localhost:3000

#### Register Test Users:

**Customer Account:**
- Name: Test Customer
- Email: customer@test.com
- Password: password123
- Role: Customer
- Income: 600000
- Credit Score: 750

**Officer Account:**
- Name: Test Officer
- Email: officer@test.com
- Password: password123
- Role: Loan Officer
- Branch: Main Branch

### Step 5: Test the Workflow

1. **Login as Customer** (customer@test.com)
   - View dashboard
   - Click "Apply for New Loan"
   - Enter: Amount = 500000, Tenure = 24 months
   - Submit and see automatic approval/rejection

2. **Login as Officer** (officer@test.com)
   - View dashboard with statistics
   - Click "Review Pending Loans"
   - Review and approve/reject applications

## 📋 Common Commands

### Backend
```powershell
cd backend
npm install          # Install dependencies
npm start           # Start server (production)
npm run dev         # Start server with nodemon (development)
```

### Frontend
```powershell
cd frontend
npm install         # Install dependencies
npm start          # Start development server
npm run build      # Build for production
```

## 🔧 Troubleshooting

### MongoDB Not Running
```powershell
# Start MongoDB service
net start MongoDB

# Or download MongoDB Compass and start a local connection
```

### Port 5000 Already in Use
Edit `backend/.env` and change PORT to another number (e.g., 5001)

### Port 3000 Already in Use
React will automatically prompt to use port 3001

### Can't Connect to API
1. Check backend is running on http://localhost:5000
2. Check `frontend/.env` has correct REACT_APP_API_URL
3. Clear browser cache and reload

## 📚 API Testing with Postman/Thunder Client

Import these endpoints to test the API:

**Base URL:** http://localhost:5000/api

**Register:**
- POST /auth/register
- Body: { "name": "John", "email": "john@test.com", "password": "pass123", "role": "CUSTOMER", "income": 500000, "creditScore": 700 }

**Login:**
- POST /auth/login
- Body: { "email": "john@test.com", "password": "pass123" }
- Copy the token from response

**Apply Loan (Add token to headers):**
- POST /loans/apply
- Headers: Authorization: Bearer YOUR_TOKEN_HERE
- Body: { "customerId": "YOUR_CUSTOMER_ID", "amountRequested": 500000, "tenureMonths": 24 }

## 🎯 Next Steps

1. ✅ Complete basic testing
2. ✅ Try different loan amounts and scenarios
3. ✅ Test officer approval/rejection workflow
4. ✅ Check responsiveness on mobile view
5. ✅ Review code structure and add custom features

## 💡 Tips

- Use Chrome DevTools (F12) to debug
- Check Console for any errors
- Check Network tab for API calls
- MongoDB data is at: mongodb://localhost:27017/loan_origination

## 📞 Need Help?

Check the full README.md for detailed documentation and API references.

**Happy Coding! 🚀**

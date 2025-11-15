# API Testing Guide

## Using Thunder Client / Postman

### Base URL
```
http://localhost:5000/api
```

## 1. Authentication APIs

### Register Customer
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Test Customer",
  "email": "testcustomer@example.com",
  "password": "password123",
  "role": "CUSTOMER",
  "income": 600000,
  "creditScore": 750
}
```

**Expected Response:** 201 Created
```json
{
  "message": "User registered successfully",
  "userId": "655abc123...",
  "role": "CUSTOMER"
}
```

### Register Officer
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Test Officer",
  "email": "testofficer@example.com",
  "password": "password123",
  "role": "OFFICER",
  "branch": "Test Branch"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "testcustomer@example.com",
  "password": "password123"
}
```

**Expected Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "655abc123...",
  "role": "CUSTOMER",
  "name": "Test Customer",
  "email": "testcustomer@example.com",
  "roleSpecificId": "655def456..."
}
```

**Important:** Copy the `token` value for use in subsequent requests!

### Get Current User
```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## 2. Customer APIs

### Get Customer Profile
```http
GET /customer/profile
Authorization: Bearer YOUR_CUSTOMER_TOKEN
```

### Update Customer Profile
```http
PUT /customer/profile
Authorization: Bearer YOUR_CUSTOMER_TOKEN
Content-Type: application/json

{
  "income": 700000,
  "creditScore": 780
}
```

## 3. Loan APIs

### Apply for Loan (Customer)
```http
POST /loans/apply
Authorization: Bearer YOUR_CUSTOMER_TOKEN
Content-Type: application/json

{
  "customerId": "YOUR_ROLE_SPECIFIC_ID",
  "amountRequested": 500000,
  "tenureMonths": 24
}
```

**Note:** Get `customerId` from login response `roleSpecificId` field

**Expected Response:** 201 Created
```json
{
  "message": "Loan application submitted successfully",
  "loanId": "655xyz789...",
  "status": "APPROVED",
  "eligibilityScore": 0.82,
  "interestRate": 7.9,
  "emi": 22650.50,
  "rejectionReason": null
}
```

### Get Loan Status
```http
GET /loans/655xyz789.../status
Authorization: Bearer YOUR_TOKEN
```

### Get Customer's All Loans
```http
GET /loans/customer/YOUR_CUSTOMER_ID
Authorization: Bearer YOUR_CUSTOMER_TOKEN
```

### Get All Loans (Officer)
```http
GET /loans
Authorization: Bearer YOUR_OFFICER_TOKEN
```

### Get Pending Loans (Officer)
```http
GET /loans?status=PENDING
Authorization: Bearer YOUR_OFFICER_TOKEN
```

## 4. Officer APIs

### Get Pending Loans for Review
```http
GET /officer/loans/pending
Authorization: Bearer YOUR_OFFICER_TOKEN
```

### Approve Loan
```http
POST /officer/loans/LOAN_ID/review
Authorization: Bearer YOUR_OFFICER_TOKEN
Content-Type: application/json

{
  "action": "APPROVE",
  "comments": "Good credit history and stable income"
}
```

### Reject Loan
```http
POST /officer/loans/LOAN_ID/review
Authorization: Bearer YOUR_OFFICER_TOKEN
Content-Type: application/json

{
  "action": "REJECT",
  "comments": "Insufficient income for requested amount"
}
```

### Get Loan Statistics
```http
GET /officer/stats
Authorization: Bearer YOUR_OFFICER_TOKEN
```

**Expected Response:**
```json
{
  "totalLoans": 50,
  "pendingLoans": 10,
  "approvedLoans": 35,
  "rejectedLoans": 5,
  "totalApprovedAmount": 15000000
}
```

### Get My Reviews
```http
GET /officer/loans/my-reviews
Authorization: Bearer YOUR_OFFICER_TOKEN
```

## Testing Flow

### Complete Customer Flow
1. Register as customer → Get userId
2. Login as customer → Get token and roleSpecificId
3. Get profile → Verify customer details
4. Apply for loan → Get loanId
5. Get loan status → Check approval/rejection
6. Get all my loans → View loan history

### Complete Officer Flow
1. Register as officer → Get userId
2. Login as officer → Get token
3. Get pending loans → View applications
4. Review loan (approve/reject) → Process application
5. Get statistics → View dashboard data
6. Get my reviews → View processed loans

## Test Scenarios

### Scenario 1: High Eligibility (Approved)
```json
{
  "name": "Rich Customer",
  "email": "rich@test.com",
  "password": "password123",
  "role": "CUSTOMER",
  "income": 1000000,
  "creditScore": 800
}
```
Apply for: ₹500,000 for 24 months
Expected: **APPROVED** with low interest rate (~7-8%)

### Scenario 2: Low Eligibility (Rejected)
```json
{
  "name": "Poor Customer",
  "email": "poor@test.com",
  "password": "password123",
  "role": "CUSTOMER",
  "income": 150000,
  "creditScore": 400
}
```
Apply for: ₹600,000 for 12 months
Expected: **REJECTED** with reason

### Scenario 3: Borderline Case
```json
{
  "name": "Average Customer",
  "email": "average@test.com",
  "password": "password123",
  "role": "CUSTOMER",
  "income": 400000,
  "creditScore": 600
}
```
Apply for: ₹300,000 for 36 months
Expected: Could be **APPROVED** or **REJECTED** (borderline)

## Error Responses

### 401 Unauthorized
```json
{
  "message": "No token provided, authorization denied"
}
```
**Solution:** Add Authorization header with Bearer token

### 403 Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```
**Solution:** Use correct role token (customer/officer)

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```
**Solution:** Check request body has all required fields

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```
**Solution:** Verify the ID in the URL is correct

## Tips

1. **Save Variables**: In Postman/Thunder Client, save token as environment variable
2. **Check Logs**: Monitor backend console for detailed error messages
3. **MongoDB**: Use MongoDB Compass to view database changes
4. **Timing**: Wait for backend to fully start before testing APIs
5. **Order**: Always register/login before testing protected endpoints

## Quick Test Script (PowerShell)

```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Register customer (PowerShell)
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "CUSTOMER"
    income = 500000
    creditScore = 700
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

## MongoDB Queries

Connect to MongoDB and run these queries to verify data:

```javascript
// View all users
db.users.find().pretty()

// View all customers
db.customers.find().pretty()

// View all loan applications
db.loanapplications.find().pretty()

// View approved loans
db.loanapplications.find({ status: "APPROVED" }).pretty()

// Count loans by status
db.loanapplications.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

---

**Happy Testing! 🧪**

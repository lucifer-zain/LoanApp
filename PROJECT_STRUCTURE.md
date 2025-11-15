# Project Structure

```
d:\Loan Assignment\
│
├── 📄 README.md                          # Complete project documentation
├── 📄 QUICKSTART.md                      # 5-minute setup guide
├── 📄 WINDOWS_SETUP.md                   # Windows-specific instructions
├── 📄 API_TESTING.md                     # API testing guide
├── 📄 PROJECT_DELIVERABLES.md            # Complete checklist
├── 📄 PROJECT_SUMMARY.md                 # Project overview
├── 📄 NodeJS TA Assignment -1 .txt       # Original requirements
├── ⚡ start.ps1                          # PowerShell startup script
├── ⚡ start.bat                          # Batch startup script
│
├── 🔧 backend/
│   ├── 📁 controllers/
│   │   ├── auth.controller.js           # Authentication logic
│   │   ├── customer.controller.js       # Customer management
│   │   ├── loan.controller.js           # Loan operations
│   │   └── officer.controller.js        # Officer operations
│   │
│   ├── 📁 middleware/
│   │   └── auth.middleware.js           # JWT authentication & role check
│   │
│   ├── 📁 models/
│   │   ├── User.model.js                # User schema
│   │   ├── Customer.model.js            # Customer schema
│   │   ├── LoanOfficer.model.js         # Loan officer schema
│   │   └── LoanApplication.model.js     # Loan application schema
│   │
│   ├── 📁 routes/
│   │   ├── auth.routes.js               # Auth endpoints
│   │   ├── customer.routes.js           # Customer endpoints
│   │   ├── loan.routes.js               # Loan endpoints
│   │   └── officer.routes.js            # Officer endpoints
│   │
│   ├── 📁 services/
│   │   └── loan.service.js              # Loan evaluation logic
│   │
│   ├── ⚙️ .env                          # Environment variables
│   ├── 📄 .gitignore                    # Git ignore file
│   ├── 📦 package.json                  # Backend dependencies
│   ├── 🚀 server.js                     # Express server entry point
│   └── 🌱 seed.js                       # Database seeding script
│
└── ⚛️ frontend/
    ├── 📁 public/
    │   └── index.html                   # HTML template
    │
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── Loader.js                # Loading spinner
    │   │   └── Navbar.js                # Navigation bar
    │   │
    │   ├── 📁 context/
    │   │   └── AuthContext.js           # Authentication context
    │   │
    │   ├── 📁 pages/
    │   │   ├── Login.js                 # Login page
    │   │   ├── Register.js              # Registration page
    │   │   ├── CustomerDashboard.js     # Customer home
    │   │   ├── ApplyLoan.js             # Loan application form
    │   │   ├── MyLoans.js               # Customer loan list
    │   │   ├── OfficerDashboard.js      # Officer home
    │   │   └── PendingLoans.js          # Loan review page
    │   │
    │   ├── 📁 utils/
    │   │   └── api.js                   # Axios configuration
    │   │
    │   ├── 🎨 App.js                    # Main app component
    │   ├── 🎨 index.css                 # Global styles
    │   └── 🚀 index.js                  # React entry point
    │
    ├── ⚙️ .env                          # Frontend environment
    ├── 📄 .gitignore                    # Git ignore file
    └── 📦 package.json                  # Frontend dependencies
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
├─────────────────────────────────────────────────────────────┤
│  React App (Port 3000)                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ App.js (Router)                                       │  │
│  │  ├── AuthContext (State Management)                  │  │
│  │  ├── Navbar (Navigation)                             │  │
│  │  │                                                    │  │
│  │  ├── Public Routes                                   │  │
│  │  │   ├── Login                                       │  │
│  │  │   └── Register                                    │  │
│  │  │                                                    │  │
│  │  └── Protected Routes                                │  │
│  │      ├── Customer (CUSTOMER role)                    │  │
│  │      │   ├── CustomerDashboard                       │  │
│  │      │   ├── ApplyLoan                               │  │
│  │      │   └── MyLoans                                 │  │
│  │      │                                                │  │
│  │      └── Officer (OFFICER role)                      │  │
│  │          ├── OfficerDashboard                        │  │
│  │          └── PendingLoans                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕ Axios (JWT Token)               │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
├─────────────────────────────────────────────────────────────┤
│  Express Server (Port 5000)                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ server.js                                             │  │
│  │  ├── Middleware (CORS, JSON, Auth)                   │  │
│  │  │                                                    │  │
│  │  ├── Routes                                           │  │
│  │  │   ├── /api/auth → auth.routes                     │  │
│  │  │   ├── /api/loans → loan.routes                    │  │
│  │  │   ├── /api/officer → officer.routes               │  │
│  │  │   └── /api/customer → customer.routes             │  │
│  │  │                                                    │  │
│  │  ├── Controllers (Business Logic)                    │  │
│  │  │   ├── auth.controller                             │  │
│  │  │   ├── loan.controller                             │  │
│  │  │   ├── officer.controller                          │  │
│  │  │   └── customer.controller                         │  │
│  │  │                                                    │  │
│  │  └── Services                                         │  │
│  │      └── loan.service (Evaluation Logic)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕ Mongoose ODM                    │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        Database                             │
├─────────────────────────────────────────────────────────────┤
│  MongoDB (localhost:27017)                                  │
│  Database: loan_origination                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Collections                                           │  │
│  │  ├── users (name, email, passwordHash, role)         │  │
│  │  ├── customers (userId→, income, creditScore)        │  │
│  │  ├── loanofficers (userId→, branch)                  │  │
│  │  └── loanapplications (customerId→, officerId→,      │  │
│  │                         amount, status, score)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Customer Loan Application Flow
```
1. Customer registers → User + Customer created
2. Customer logs in → JWT token issued
3. Customer applies for loan → LoanApplication created
4. Loan service evaluates → Eligibility score calculated
5. Status updated → APPROVED or REJECTED
6. Customer views status → Loan details displayed
```

### Officer Review Flow
```
1. Officer registers → User + LoanOfficer created
2. Officer logs in → JWT token issued
3. Officer views pending loans → Query by status
4. Officer reviews application → View customer details
5. Officer approves/rejects → Update status + add comments
6. Loan updated → Customer can see decision
```

## Database Relationships

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     ├──────────────┬──────────────┐
     │              │              │
┌────▼─────┐  ┌────▼─────┐       │
│ Customer │  │LoanOfficer│       │
└────┬─────┘  └────┬─────┘       │
     │              │              │
     │              │              │
     └──────┬───────┘              │
            │                      │
      ┌─────▼──────┐              │
      │   Loan     │◄─────────────┘
      │Application │
      └────────────┘
```

## API Request Flow

```
Client Request
     │
     ▼
┌─────────────────┐
│  Express Router │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Auth Middleware │ → Verify JWT Token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Role Middleware │ → Check User Role
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │ → Business Logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Service     │ → Complex Operations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mongoose Model │ → Database Query
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     MongoDB     │
└────────┬────────┘
         │
         ▼
Response to Client
```

## File Statistics

| Category | Count |
|----------|-------|
| Backend JS Files | 15 |
| Frontend JS Files | 13 |
| Configuration Files | 6 |
| Documentation Files | 7 |
| Scripts | 2 |
| **Total** | **43** |

## Lines of Code (Approximate)

| Component | LOC |
|-----------|-----|
| Backend | ~2,000 |
| Frontend | ~2,200 |
| Documentation | ~3,000 |
| **Total** | **~7,200** |

---

**This structure ensures:**
- ✅ Separation of concerns
- ✅ Modular architecture
- ✅ Scalable design
- ✅ Easy maintenance
- ✅ Clear data flow

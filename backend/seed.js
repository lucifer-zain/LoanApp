const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User.model');
const Customer = require('./models/Customer.model');
const LoanOfficer = require('./models/LoanOfficer.model');
const LoanApplication = require('./models/LoanApplication.model');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Customer.deleteMany({});
    await LoanOfficer.deleteMany({});
    await LoanApplication.deleteMany({});
    console.log('Existing data cleared.');

    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create Users
    console.log('Creating users...');
    
    // Customer 1
    const customer1User = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      passwordHash,
      role: 'CUSTOMER'
    });

    const customer1 = await Customer.create({
      userId: customer1User._id,
      income: 800000,
      creditScore: 780
    });

    // Customer 2
    const customer2User = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      passwordHash,
      role: 'CUSTOMER'
    });

    const customer2 = await Customer.create({
      userId: customer2User._id,
      income: 450000,
      creditScore: 650
    });

    // Customer 3
    const customer3User = await User.create({
      name: 'Amit Singh',
      email: 'amit@example.com',
      passwordHash,
      role: 'CUSTOMER'
    });

    const customer3 = await Customer.create({
      userId: customer3User._id,
      income: 250000,
      creditScore: 550
    });

    // Customer 4 (Low eligibility)
    const customer4User = await User.create({
      name: 'Neha Patel',
      email: 'neha@example.com',
      passwordHash,
      role: 'CUSTOMER'
    });

    const customer4 = await Customer.create({
      userId: customer4User._id,
      income: 180000,
      creditScore: 480
    });

    // Officer 1
    const officer1User = await User.create({
      name: 'Suresh Reddy',
      email: 'suresh@example.com',
      passwordHash,
      role: 'OFFICER'
    });

    const officer1 = await LoanOfficer.create({
      userId: officer1User._id,
      branch: 'Mumbai Branch'
    });

    // Officer 2
    const officer2User = await User.create({
      name: 'Kavita Desai',
      email: 'kavita@example.com',
      passwordHash,
      role: 'OFFICER'
    });

    const officer2 = await LoanOfficer.create({
      userId: officer2User._id,
      branch: 'Delhi Branch'
    });

    console.log('Users created successfully.');

    // Create Loan Applications
    console.log('Creating loan applications...');

    // Import loan service for evaluation
    const { evaluateLoan } = require('./services/loan.service');

    // Approved loan
    const loan1 = await LoanApplication.create({
      customerId: customer1._id,
      amountRequested: 500000,
      tenureMonths: 24,
      status: 'PENDING'
    });
    await evaluateLoan(loan1._id);

    // Pending loan
    const loan2 = await LoanApplication.create({
      customerId: customer2._id,
      amountRequested: 300000,
      tenureMonths: 36,
      status: 'PENDING'
    });
    await evaluateLoan(loan2._id);

    // Another pending loan
    const loan3 = await LoanApplication.create({
      customerId: customer3._id,
      amountRequested: 200000,
      tenureMonths: 12,
      status: 'PENDING'
    });
    await evaluateLoan(loan3._id);

    // Rejected loan
    const loan4 = await LoanApplication.create({
      customerId: customer4._id,
      amountRequested: 600000,
      tenureMonths: 24,
      status: 'PENDING'
    });
    await evaluateLoan(loan4._id);

    // Manually approved loan
    const loan5 = await LoanApplication.create({
      customerId: customer1._id,
      officerId: officer1._id,
      amountRequested: 1000000,
      tenureMonths: 60,
      interestRate: 8.5,
      status: 'APPROVED',
      eligibilityScore: 0.85
    });

    // Manually rejected loan
    const loan6 = await LoanApplication.create({
      customerId: customer3._id,
      officerId: officer2._id,
      amountRequested: 400000,
      tenureMonths: 24,
      interestRate: 10,
      status: 'REJECTED',
      eligibilityScore: 0.35,
      rejectionReason: 'Insufficient income and low credit score'
    });

    console.log('Loan applications created successfully.');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Accounts (Password for all: password123):');
    console.log('\nCustomers:');
    console.log('1. rajesh@example.com (High eligibility)');
    console.log('2. priya@example.com (Medium eligibility)');
    console.log('3. amit@example.com (Low-Medium eligibility)');
    console.log('4. neha@example.com (Low eligibility)');
    console.log('\nOfficers:');
    console.log('1. suresh@example.com (Mumbai Branch)');
    console.log('2. kavita@example.com (Delhi Branch)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();

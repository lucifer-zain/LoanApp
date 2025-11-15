import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, loansRes] = await Promise.all([
        api.get('/customer/profile'),
        api.get(`/loans/customer/${user.roleSpecificId}`)
      ]);
      
      setProfile(profileRes.data);
      setLoans(loansRes.data.loans);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const pendingLoans = loans.filter(loan => loan.status === 'PENDING').length;
  const approvedLoans = loans.filter(loan => loan.status === 'APPROVED').length;
  const rejectedLoans = loans.filter(loan => loan.status === 'REJECTED').length;
  const totalApproved = loans
    .filter(loan => loan.status === 'APPROVED')
    .reduce((sum, loan) => sum + loan.amountRequested, 0);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
        <p className="dashboard-subtitle">Customer Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Annual Income</div>
          <div className="stat-value">₹{profile?.income?.toLocaleString() || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Credit Score</div>
          <div className="stat-value">{profile?.creditScore || 300}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Applications</div>
          <div className="stat-value">{loans.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved Amount</div>
          <div className="stat-value">₹{totalApproved.toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Loan Status Overview</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: '#ffc107' }}>{pendingLoans}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-value" style={{ color: '#28a745' }}>{approvedLoans}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Rejected</div>
            <div className="stat-value" style={{ color: '#dc3545' }}>{rejectedLoans}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/apply-loan">
            <button className="btn btn-primary">Apply for New Loan</button>
          </Link>
          <Link to="/my-loans">
            <button className="btn btn-secondary">View All Loans</button>
          </Link>
        </div>
      </div>

      {loans.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Loan Applications</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Status</th>
                  <th>Eligibility Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loans.slice(0, 5).map((loan) => (
                  <tr key={loan._id}>
                    <td>₹{loan.amountRequested.toLocaleString()}</td>
                    <td>{loan.tenureMonths} months</td>
                    <td>
                      <span className={`status-badge status-${loan.status.toLowerCase()}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      {loan.eligibilityScore 
                        ? (loan.eligibilityScore * 100).toFixed(2) + '%'
                        : 'N/A'}
                    </td>
                    <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

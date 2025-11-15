import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, loansRes] = await Promise.all([
        api.get('/officer/stats'),
        api.get('/loans?status=PENDING')
      ]);
      
      setStats(statsRes.data);
      setRecentLoans(loansRes.data.loans.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
        <p className="dashboard-subtitle">Loan Officer Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Applications</div>
          <div className="stat-value">{stats?.totalLoans || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value" style={{ color: '#ffc107' }}>
            {stats?.pendingLoans || 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved</div>
          <div className="stat-value" style={{ color: '#28a745' }}>
            {stats?.approvedLoans || 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value" style={{ color: '#dc3545' }}>
            {stats?.rejectedLoans || 0}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Total Approved Loan Amount</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#28a745' }}>
            ₹{(stats?.totalApprovedAmount || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/pending-loans">
            <button className="btn btn-primary">
              Review Pending Loans ({stats?.pendingLoans || 0})
            </button>
          </Link>
        </div>
      </div>

      {recentLoans.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Pending Applications</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Credit Score</th>
                  <th>Income</th>
                  <th>Eligibility Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan.customerId?.userId?.name || 'N/A'}</td>
                    <td>₹{loan.amountRequested.toLocaleString()}</td>
                    <td>{loan.tenureMonths} months</td>
                    <td>{loan.customerId?.creditScore || 'N/A'}</td>
                    <td>₹{(loan.customerId?.income || 0).toLocaleString()}</td>
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

export default OfficerDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';

const MyLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get(`/loans/customer/${user.roleSpecificId}`);
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const filteredLoans = filter === 'ALL' 
    ? loans 
    : loans.filter(loan => loan.status === filter);

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">My Loan Applications</h2>
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All ({loans.length})
          </button>
          <button 
            className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending ({loans.filter(l => l.status === 'PENDING').length})
          </button>
          <button 
            className={`btn ${filter === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('APPROVED')}
          >
            Approved ({loans.filter(l => l.status === 'APPROVED').length})
          </button>
          <button 
            className={`btn ${filter === 'REJECTED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('REJECTED')}
          >
            Rejected ({loans.filter(l => l.status === 'REJECTED').length})
          </button>
        </div>

        {filteredLoans.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No loan applications found.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Interest Rate</th>
                  <th>EMI</th>
                  <th>Status</th>
                  <th>Eligibility Score</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan._id}>
                    <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {loan._id.slice(-8)}
                    </td>
                    <td>₹{loan.amountRequested.toLocaleString()}</td>
                    <td>{loan.tenureMonths} months</td>
                    <td>
                      {loan.interestRate 
                        ? loan.interestRate.toFixed(2) + '%'
                        : 'N/A'}
                    </td>
                    <td>
                      {loan.emi 
                        ? '₹' + loan.emi.toLocaleString()
                        : 'N/A'}
                    </td>
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
        )}

        {filteredLoans.some(loan => loan.status === 'REJECTED' && loan.rejectionReason) && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#dc3545' }}>Rejection Reasons</h3>
            {filteredLoans
              .filter(loan => loan.status === 'REJECTED' && loan.rejectionReason)
              .map(loan => (
                <div key={loan._id} style={{ 
                  background: '#f8d7da', 
                  padding: '1rem', 
                  borderRadius: '5px',
                  marginBottom: '0.5rem',
                  border: '1px solid #f5c6cb'
                }}>
                  <strong>Application {loan._id.slice(-8)}:</strong> {loan.rejectionReason}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoans;

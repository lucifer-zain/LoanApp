import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Loader from '../components/Loader';

const PendingLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      const response = await api.get('/officer/loans/pending');
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Error fetching pending loans:', error);
      toast.error('Error fetching pending loans');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (loanId, action) => {
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this loan application?`)) {
      return;
    }

    setProcessingId(loanId);

    try {
      await api.post(`/officer/loans/${loanId}/review`, {
        action,
        comments: comments || undefined
      });

      toast.success(`Loan application ${action.toLowerCase()}d successfully`);
      
      // Remove the loan from the list
      setLoans(loans.filter(loan => loan._id !== loanId));
      setSelectedLoan(null);
      setComments('');
    } catch (error) {
      toast.error(error.response?.data?.message || `Error ${action.toLowerCase()}ing loan`);
    } finally {
      setProcessingId(null);
    }
  };

  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = rate / 12 / 100;
    if (monthlyRate === 0) return principal / tenure;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                 (Math.pow(1 + monthlyRate, tenure) - 1);
    
    return Math.round(emi * 100) / 100;
  };

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Pending Loan Applications ({loans.length})</h2>
        </div>

        {loans.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No pending loan applications to review.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Income</th>
                  <th>Credit Score</th>
                  <th>Eligibility</th>
                  <th>Applied On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <React.Fragment key={loan._id}>
                    <tr 
                      style={{ 
                        background: selectedLoan?._id === loan._id ? '#f0f0f0' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedLoan(selectedLoan?._id === loan._id ? null : loan)}
                    >
                      <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {loan._id.slice(-8)}
                      </td>
                      <td>{loan.customerId?.userId?.name || 'N/A'}</td>
                      <td>{loan.customerId?.userId?.email || 'N/A'}</td>
                      <td>₹{loan.amountRequested.toLocaleString()}</td>
                      <td>{loan.tenureMonths} months</td>
                      <td>₹{(loan.customerId?.income || 0).toLocaleString()}</td>
                      <td>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: loan.customerId?.creditScore >= 700 ? '#28a745' : 
                                 loan.customerId?.creditScore >= 550 ? '#ffc107' : '#dc3545'
                        }}>
                          {loan.customerId?.creditScore || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: loan.eligibilityScore >= 0.7 ? '#28a745' : 
                                 loan.eligibilityScore >= 0.5 ? '#ffc107' : '#dc3545'
                        }}>
                          {loan.eligibilityScore 
                            ? (loan.eligibilityScore * 100).toFixed(2) + '%'
                            : 'N/A'}
                        </span>
                      </td>
                      <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReview(loan._id, 'APPROVE');
                            }}
                            disabled={processingId === loan._id}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReview(loan._id, 'REJECT');
                            }}
                            disabled={processingId === loan._id}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedLoan?._id === loan._id && (
                      <tr>
                        <td colSpan="10" style={{ background: '#f8f9fa', padding: '1.5rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div>
                              <strong>Loan Details</strong>
                              <div style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
                                <div>Amount: ₹{loan.amountRequested.toLocaleString()}</div>
                                <div>Tenure: {loan.tenureMonths} months</div>
                                <div>Interest Rate: {loan.interestRate?.toFixed(2) || '10.00'}%</div>
                                <div>
                                  Estimated EMI: ₹
                                  {calculateEMI(
                                    loan.amountRequested, 
                                    loan.interestRate || 10, 
                                    loan.tenureMonths
                                  ).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div>
                              <strong>Customer Details</strong>
                              <div style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
                                <div>Name: {loan.customerId?.userId?.name}</div>
                                <div>Email: {loan.customerId?.userId?.email}</div>
                                <div>Income: ₹{(loan.customerId?.income || 0).toLocaleString()}</div>
                                <div>Credit Score: {loan.customerId?.creditScore}</div>
                              </div>
                            </div>
                            <div>
                              <strong>Eligibility Analysis</strong>
                              <div style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
                                <div>Score: {loan.eligibilityScore ? (loan.eligibilityScore * 100).toFixed(2) + '%' : 'N/A'}</div>
                                <div>
                                  Status: 
                                  <span style={{ 
                                    marginLeft: '0.5rem',
                                    fontWeight: 'bold',
                                    color: loan.eligibilityScore >= 0.5 ? '#28a745' : '#dc3545'
                                  }}>
                                    {loan.eligibilityScore >= 0.5 ? 'Eligible' : 'Not Eligible'}
                                  </span>
                                </div>
                                {loan.rejectionReason && (
                                  <div style={{ marginTop: '0.5rem', color: '#dc3545' }}>
                                    Reason: {loan.rejectionReason}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{ marginTop: '1rem' }}>
                            <label className="form-label">Comments (optional for rejection)</label>
                            <textarea
                              className="form-input"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              placeholder="Enter comments or rejection reason"
                              rows="3"
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingLoans;

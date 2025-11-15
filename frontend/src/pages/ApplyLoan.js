import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ApplyLoan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amountRequested: '',
    tenureMonths: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/loans/apply', {
        customerId: user.roleSpecificId,
        amountRequested: Number(formData.amountRequested),
        tenureMonths: Number(formData.tenureMonths),
      });

      if (response.data.status === 'APPROVED') {
        toast.success('Congratulations! Your loan has been approved!');
      } else if (response.data.status === 'REJECTED') {
        toast.error(`Loan application rejected: ${response.data.rejectionReason}`);
      } else {
        toast.info('Loan application submitted for review');
      }

      navigate('/my-loans');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting loan application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header">
          <h2 className="card-title">Apply for Loan</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Loan Amount (₹)</label>
            <input
              type="number"
              name="amountRequested"
              className="form-input"
              value={formData.amountRequested}
              onChange={handleChange}
              required
              min="1000"
              placeholder="Enter loan amount"
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Minimum: ₹1,000
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Tenure (Months)</label>
            <input
              type="number"
              name="tenureMonths"
              className="form-input"
              value={formData.tenureMonths}
              onChange={handleChange}
              required
              min="1"
              max="360"
              placeholder="Enter tenure in months"
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Range: 1-360 months
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto 0' }}>
        <div className="card-header">
          <h3 className="card-title">Eligibility Criteria</h3>
        </div>
        <ul style={{ lineHeight: '2', color: '#555' }}>
          <li>Minimum annual income: ₹2,00,000</li>
          <li>Minimum credit score: 550</li>
          <li>Monthly EMI should not exceed 50% of monthly income</li>
          <li>Higher credit score and income increase approval chances</li>
        </ul>
      </div>
    </div>
  );
};

export default ApplyLoan;

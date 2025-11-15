import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    income: '',
    creditScore: '',
    branch: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === 'CUSTOMER') {
      userData.income = Number(formData.income) || 0;
      userData.creditScore = Number(formData.creditScore) || 300;
    } else if (formData.role === 'OFFICER') {
      userData.branch = formData.branch || 'Main Branch';
    }

    const result = await register(userData);
    
    if (result.success) {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="OFFICER">Loan Officer</option>
            </select>
          </div>

          {formData.role === 'CUSTOMER' && (
            <>
              <div className="form-group">
                <label className="form-label">Annual Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  className="form-input"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="Enter your annual income"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Credit Score (300-850)</label>
                <input
                  type="number"
                  name="creditScore"
                  className="form-input"
                  value={formData.creditScore}
                  onChange={handleChange}
                  min="300"
                  max="850"
                  placeholder="Enter your credit score"
                />
              </div>
            </>
          )}

          {formData.role === 'OFFICER' && (
            <div className="form-group">
              <label className="form-label">Branch</label>
              <input
                type="text"
                name="branch"
                className="form-input"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Enter branch name"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

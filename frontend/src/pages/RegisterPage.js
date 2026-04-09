import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    first_name: '', last_name: '', years_of_experience: 0,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    if (errors[e.target.name]) {
      const updated = { ...errors };
      delete updated[e.target.name];
      setErrors(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setServerError(data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (name) => ({
    className: errors[name] ? 'input-error' : '',
  });

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-logo">
          <span className="logo-icon">🍽️</span>
          <h1>Kitchen Service</h1>
          <p>Create your cook account</p>
        </div>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First name" {...field('first_name')} />
              {errors.first_name && <span className="field-error">{errors.first_name}</span>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last name" {...field('last_name')} />
              {errors.last_name && <span className="field-error">{errors.last_name}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" {...field('username')} />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" {...field('email')} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 chars, uppercase, digit, symbol" {...field('password')} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input name="years_of_experience" type="number" min="0" value={form.years_of_experience} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

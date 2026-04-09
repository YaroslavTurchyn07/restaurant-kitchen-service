import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const validate = (form) => {
  const errors = {};

  if (form.first_name.length < 2 || form.first_name.length > 20)
    errors.first_name = 'First name must be 2–20 characters';

  if (form.last_name.length < 2 || form.last_name.length > 20)
    errors.last_name = 'Last name must be 2–20 characters';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(form.email))
    errors.email = 'Enter a valid email address';

  const pwd = form.password;
  if (pwd.length < 8)
    errors.password = 'Password must be at least 8 characters';
  else if (!/[A-Z]/.test(pwd))
    errors.password = 'Password must contain at least one uppercase letter';
  else if (!/[0-9]/.test(pwd))
    errors.password = 'Password must contain at least one digit';
  else if (!/[^A-Za-z0-9]/.test(pwd))
    errors.password = 'Password must contain at least one special character';

  return errors;
};

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
    const updated = { ...form, [e.target.name]: value };
    setForm(updated);
    if (errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                placeholder="First name"
                className={errors.first_name ? 'input-error' : ''}
              />
              {errors.first_name && <span className="field-error">{errors.first_name}</span>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                placeholder="Last name"
                className={errors.last_name ? 'input-error' : ''}
              />
              {errors.last_name && <span className="field-error">{errors.last_name}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required placeholder="Choose a username" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email address"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Min 8 chars, uppercase, digit, symbol"
              className={errors.password ? 'input-error' : ''}
            />
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

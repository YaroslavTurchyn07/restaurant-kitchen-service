const jwt = require('jsonwebtoken');
const { Cook } = require('../models');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const validateRegister = (data) => {
  const errors = {};
  const { first_name, last_name, username, email, password } = data;

  if (!first_name || first_name.trim().length < 2 || first_name.trim().length > 20)
    errors.first_name = 'First name must be 2–20 characters';

  if (!last_name || last_name.trim().length < 2 || last_name.trim().length > 20)
    errors.last_name = 'Last name must be 2–20 characters';

  if (!username || username.trim().length < 3 || username.trim().length > 50)
    errors.username = 'Username must be 3–50 characters';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailRegex.test(email))
    errors.email = 'Enter a valid email address';

  if (!password || password.length < 8)
    errors.password = 'Password must be at least 8 characters';
  else if (!/[A-Z]/.test(password))
    errors.password = 'Password must contain at least one uppercase letter';
  else if (!/[0-9]/.test(password))
    errors.password = 'Password must contain at least one digit';
  else if (!/[^A-Za-z0-9]/.test(password))
    errors.password = 'Password must contain at least one special character';

  return errors;
};

const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, years_of_experience } = req.body;

    const errors = validateRegister(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const cook = await Cook.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      years_of_experience: years_of_experience || 0,
    });
    const token = signToken(cook.id);
    res.status(201).json({ token, cook });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors[0]?.path;
      const errors = {};
      if (field === 'username') errors.username = 'Username already taken';
      else if (field === 'email') errors.email = 'Email already registered';
      return res.status(400).json({ message: 'Already exists', errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = {};
    if (!username || !username.trim()) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const cook = await Cook.findOne({ where: { username: username.trim() } });
    if (!cook || !(await cook.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials', errors: { username: 'Invalid username or password' } });
    }
    const token = signToken(cook.id);
    res.json({ token, cook });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const me = async (req, res) => {
  res.json(req.cook);
};

module.exports = { register, login, me };

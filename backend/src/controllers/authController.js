const jwt = require('jsonwebtoken');
const { Cook } = require('../models');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, years_of_experience } = req.body;
    const cook = await Cook.create({ username, email, password, first_name, last_name, years_of_experience });
    const token = signToken(cook.id);
    res.status(201).json({ token, cook });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    const cook = await Cook.findOne({ where: { username } });
    if (!cook || !(await cook.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
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

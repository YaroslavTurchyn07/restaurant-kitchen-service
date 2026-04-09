const { DishType, Dish } = require('../models');

const getAll = async (req, res) => {
  try {
    const types = await DishType.findAll({ include: [{ model: Dish, as: 'dishes' }] });
    res.json(types);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const type = await DishType.findByPk(req.params.id, { include: [{ model: Dish, as: 'dishes' }] });
    if (!type) return res.status(404).json({ message: 'Dish type not found' });
    res.json(type);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const type = await DishType.create({ name });
    res.status(201).json(type);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Dish type already exists' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const type = await DishType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Dish type not found' });
    await type.update({ name: req.body.name });
    res.json(type);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Dish type already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const type = await DishType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Dish type not found' });
    await type.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, getOne, create, update, remove };

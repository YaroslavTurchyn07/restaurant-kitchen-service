const { Ingredient } = require('../models');

const getAll = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll({ order: [['name', 'ASC']] });
    res.json(ingredients);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(ingredient);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const { name, unit } = req.body;
    const ingredient = await Ingredient.create({ name, unit });
    res.status(201).json(ingredient);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ingredient already exists' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    await ingredient.update({ name: req.body.name, unit: req.body.unit });
    res.json(ingredient);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ingredient already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    await ingredient.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, getOne, create, update, remove };

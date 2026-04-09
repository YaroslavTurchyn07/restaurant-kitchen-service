const { Cook, Dish, DishType } = require('../models');

const getAll = async (req, res) => {
  try {
    const cooks = await Cook.findAll({
      include: [{ model: Dish, as: 'dishes', include: [{ model: DishType, as: 'dishType' }] }],
    });
    res.json(cooks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const cook = await Cook.findByPk(req.params.id, {
      include: [{ model: Dish, as: 'dishes', include: [{ model: DishType, as: 'dishType' }] }],
    });
    if (!cook) return res.status(404).json({ message: 'Cook not found' });
    res.json(cook);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const cook = await Cook.findByPk(req.params.id);
    if (!cook) return res.status(404).json({ message: 'Cook not found' });
    if (cook.id !== req.cook.id) return res.status(403).json({ message: 'Forbidden' });

    const { first_name, last_name, years_of_experience, email } = req.body;
    await cook.update({ first_name, last_name, years_of_experience, email });
    res.json(cook);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const cook = await Cook.findByPk(req.params.id);
    if (!cook) return res.status(404).json({ message: 'Cook not found' });
    if (cook.id !== req.cook.id) return res.status(403).json({ message: 'Forbidden' });
    await cook.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, getOne, update, remove };

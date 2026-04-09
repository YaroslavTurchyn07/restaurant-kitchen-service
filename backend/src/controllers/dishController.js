const { Dish, DishType, Cook, Ingredient } = require('../models');

const include = [
  { model: DishType, as: 'dishType' },
  { model: Cook, as: 'cooks', attributes: ['id', 'username', 'first_name', 'last_name'] },
  { model: Ingredient, as: 'ingredients' },
];

const getAll = async (req, res) => {
  try {
    const dishes = await Dish.findAll({ include });
    res.json(dishes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id, { include });
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, price, dish_type_id, cook_ids, ingredient_ids } = req.body;
    const dish = await Dish.create({ name, description, price, dish_type_id });

    const cookIds = cook_ids && cook_ids.length ? cook_ids : [req.cook.id];
    await dish.setCooks(cookIds);

    if (ingredient_ids && ingredient_ids.length) {
      await dish.setIngredients(ingredient_ids);
    }

    const full = await Dish.findByPk(dish.id, { include });
    res.status(201).json(full);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    const { name, description, price, dish_type_id, cook_ids, ingredient_ids } = req.body;
    await dish.update({ name, description, price, dish_type_id });

    if (cook_ids !== undefined) await dish.setCooks(cook_ids);
    if (ingredient_ids !== undefined) await dish.setIngredients(ingredient_ids);

    const full = await Dish.findByPk(dish.id, { include });
    res.json(full);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    await dish.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, getOne, create, update, remove };

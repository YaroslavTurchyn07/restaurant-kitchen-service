const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cook = require('./Cook');
const DishType = require('./DishType');
const Dish = require('./Dish');
const Ingredient = require('./Ingredient');

// Explicit junction models — prevents Sequelize/SQLite from adding
// individual UNIQUE constraints on each FK column separately.
const DishCook = sequelize.define('dish_cooks', {
  dish_id: { type: DataTypes.INTEGER, primaryKey: true },
  cook_id: { type: DataTypes.INTEGER, primaryKey: true },
}, { tableName: 'dish_cooks', timestamps: true });

const DishIngredient = sequelize.define('dish_ingredients', {
  dish_id: { type: DataTypes.INTEGER, primaryKey: true },
  ingredient_id: { type: DataTypes.INTEGER, primaryKey: true },
}, { tableName: 'dish_ingredients', timestamps: true });

// DishType -> Dish (one-to-many)
DishType.hasMany(Dish, { foreignKey: 'dish_type_id', as: 'dishes' });
Dish.belongsTo(DishType, { foreignKey: 'dish_type_id', as: 'dishType' });

// Dish <-> Cook (many-to-many)
Dish.belongsToMany(Cook, {
  through: DishCook,
  foreignKey: 'dish_id',
  otherKey: 'cook_id',
  as: 'cooks',
});
Cook.belongsToMany(Dish, {
  through: DishCook,
  foreignKey: 'cook_id',
  otherKey: 'dish_id',
  as: 'dishes',
});

// Dish <-> Ingredient (many-to-many)
Dish.belongsToMany(Ingredient, {
  through: DishIngredient,
  foreignKey: 'dish_id',
  otherKey: 'ingredient_id',
  as: 'ingredients',
});
Ingredient.belongsToMany(Dish, {
  through: DishIngredient,
  foreignKey: 'ingredient_id',
  otherKey: 'dish_id',
  as: 'dishes',
});

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Database sync error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, Cook, DishType, Dish, Ingredient, syncDatabase };

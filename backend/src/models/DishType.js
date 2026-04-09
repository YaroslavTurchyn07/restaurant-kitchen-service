const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DishType = sequelize.define('DishType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [2, 100] },
  },
}, {
  tableName: 'dish_types',
});

module.exports = DishType;

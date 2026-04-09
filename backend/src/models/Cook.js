const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Cook = sequelize.define('Cook', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [3, 50] },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
  },
}, {
  tableName: 'cooks',
  hooks: {
    beforeCreate: async (cook) => {
      cook.password = await bcrypt.hash(cook.password, 10);
    },
    beforeUpdate: async (cook) => {
      if (cook.changed('password')) {
        cook.password = await bcrypt.hash(cook.password, 10);
      }
    },
  },
});

Cook.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Cook.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Cook;

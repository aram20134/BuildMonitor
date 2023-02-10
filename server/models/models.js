const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
});

const Project = sequelize.define('project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  image: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  code: { type: DataTypes.STRING },
  dateStart: { type: DataTypes.DATE },
  dateEnd: { type: DataTypes.DATE },
  description: { type: DataTypes.STRING },
  webPage: { type: DataTypes.STRING },
  street: { type: DataTypes.STRING },
  postalCode: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
})

module.exports = {
  User, Project
};

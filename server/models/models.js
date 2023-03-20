const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
});

const Project = sequelize.define('project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  image: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  code: { type: DataTypes.STRING },
  dateStart: { type: DataTypes.DATE, allowNull:true },
  dateEnd: { type: DataTypes.DATE, allowNull:true  },
  description: { type: DataTypes.STRING },
  webPage: { type: DataTypes.STRING },
  street: { type: DataTypes.STRING },
  postalCode: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
})

const Layer = sequelize.define('layers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  pos: { type: DataTypes.INTEGER, defaultValue: 0 },
  plan: { type: DataTypes.STRING }
})

const Task = sequelize.define('tasks', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING, allowNull: false }
})

const TaskInfo = sequelize.define('taskInfos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // type: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING }
})

const Form = sequelize.define('forms', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
})

const FormInfo = sequelize.define('formInfos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
})

const ListInfo = sequelize.define('listInfos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  ico: { type: DataTypes.STRING }
})

const Access = sequelize.define('access', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

User.belongsToMany(Project, {through: Access})
Project.belongsToMany(User, {through: Access})

Project.hasMany(Layer)
Layer.belongsTo(Project)

Layer.hasMany(Task)
Task.belongsTo(Layer)

Form.hasMany(Task)
Task.belongsTo(Form)

Task.hasMany(TaskInfo)
TaskInfo.belongsTo(Task)

Form.hasMany(FormInfo)
FormInfo.belongsTo(Form)

FormInfo.hasMany(ListInfo)
ListInfo.belongsTo(FormInfo)

module.exports = {
  User, Project, Layer, Form, Task, FormInfo, TaskInfo, ListInfo, Access
};

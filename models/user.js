'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, { foreignKey: 'UserId' })
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
     unique: true,
     validate: {
       isEmail: {
         args: true,
         msg: "Invalid email format"
       },
       notEmpty: {
        args: true,
        msg: 'Email is required'
      }
     }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Password is require"
        }
      }
    },
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  })
  User.beforeCreate((user, option) => {
    user.password = hashPassword(user.password)
    if(!user.isAdmin) user.isAdmin = "no"
  });
  return User;
};
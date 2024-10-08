module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      timestamps: true, // Includes createdAt and updatedAt fields
    });
  
    return User;
  };
  
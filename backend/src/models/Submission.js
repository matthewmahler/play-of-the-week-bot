const Sequelize = require("sequelize");

module.exports = sequelize.define("Submission", {
  id: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  username: { type: Sequelize.STRING(100), allowNull: false },
  url: { type: Sequelize.STRING(100), allowNull: false },
  isWinner: { type: Sequelize.BOOLEAN, allowNull: true, unique: true },
});

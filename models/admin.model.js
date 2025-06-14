import { DataTypes, Sequelize } from "sequelize";

export const defineAdmin = (sequelize, DataTypes) => {
   return sequelize.define("admin", {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },
      username: {
         type: DataTypes.STRING(100),
         allowNull: false,
         unique: true,
      },
      password: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
   },
      {
         timestamps: false, // ⛔ disables createdAt/updatedAt
      });
};
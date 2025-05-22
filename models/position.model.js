export const definePosition = (sequelize, DataTypes) => {
   return sequelize.define("position", {
      name: DataTypes.String
   })
}
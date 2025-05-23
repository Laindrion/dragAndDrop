export const defineCountry = (sequelize, DataTypes) => {
   return sequelize.define("country", {
      name: DataTypes.STRING
   })
}
export default (sequelize, DataTypes) => {
   const LandingPage = sequelize.define("landing_page", {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      name: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      html: {
         type: DataTypes.TEXT,
         allowNull: false,
      },
      css: {
         type: DataTypes.TEXT,
      },
   });

   LandingPage.associate = (models) => {
      LandingPage.belongsTo(models.Admin, {
         foreignKey: "user_id",
         as: "admin"
      });
   };

   return LandingPage;
};

export const defineRegistration = (sequelize, DataTypes) => {
   return sequelize.define("registration", {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      dob: DataTypes.STRING,
      country: DataTypes.STRING,
      position: DataTypes.STRING,
      profilePhoto: DataTypes.STRING,
      passportPhoto: DataTypes.STRING,
      status: {
         type: DataTypes.STRING,
         defaultValue: "pending", // Default status
      }
   })
}


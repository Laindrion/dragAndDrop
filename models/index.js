import { DataTypes, Sequelize, } from "sequelize";
import { dbConfig } from "../config/db.config.js";
import { defineRegistration } from "./registration.model.js";
import { defineCountry } from "./country.model.js";
import { definePosition } from "./position.model.js";
import { defineAdmin } from "./admin.model.js";

const sequelize = new Sequelize(
   dbConfig.DB,
   dbConfig.USER,
   dbConfig.PASSWORD,
   {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      port: dbConfig.PORT
   }
)

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.registration = defineRegistration(sequelize, DataTypes);
db.country = defineCountry(sequelize, DataTypes);
db.position = definePosition(sequelize, DataTypes);
db.Admin = defineAdmin(sequelize, DataTypes);

export default db;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./models/index.js";
import registrationRoutes from "./routes/registration.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", registrationRoutes);

db.sequelize.sync().then(() => {
   console.log("Database synced");
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
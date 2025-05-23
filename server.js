import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./models/index.js";
import registrationRoutes from "./routes/registration.routes.js";
import countryRoutes from "./routes/country.routes.js";
import positionRoutes from "./routes/position.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/register", registrationRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/positions", positionRoutes);

app.use((err, req, res, next) => {
   if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message })
   } else if (err) {
      return res.status(500).json({ message: err.message })
   }

   next();
});

db.sequelize.sync().then(() => {
   console.log("Database synced");
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
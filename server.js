import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./models/index.js";
import registrationRoutes from "./routes/registration.routes.js";
import countryRoutes from "./routes/country.routes.js";
import positionRoutes from "./routes/position.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/register", registrationRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/admin", adminRoutes);

import { sendEmail } from "./utils/sendEmail.js";

app.get("/test-email", async (req, res) => {
   try {
      await sendEmail(
         "igencap@gmail.com",
         "Test Email from Registration System",
         "<p>This is a test email. If you see this, your config works!</p>"
      );
      res.send("✅ Test email sent");
   } catch (err) {
      console.error("❌ Failed to send test email:", err.message);
      res.status(500).json({ message: "Failed to send test email" });
   }
});

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


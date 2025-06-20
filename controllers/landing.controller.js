import db from "../models/index.js";
const LandingPage = db.LandingPage;

/* CREATE PAGE */
export const createLandingPage = async (req, res) => {
   try {
      const { user_id, name, html, css } = req.body;

      if (!user_id || !name || !html) {
         return res.status(400).json({ message: "Missing required fields" });
      }

      const landing = await LandingPage.create({ user_id, name, html, css });
      res.status(201).json({ message: "Landing page created", data: landing });
   } catch (err) {
      console.error("❌ Error saving landing page:", err.message);
      res.status(500).json({ message: "Server error" });
   }
};
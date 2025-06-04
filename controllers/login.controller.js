import bcrypt from "bcrypt";
import jwt from "bcrypt";

import db from "../models/index.js";

export const loginAdmin = async (req, res) => {
   const { username, password } = req.body;

   const admin = await db.Admin.findOne({ where: { username } })
   if (!admin) return res.status(401).json({ message: "Invalid credentials" });

   const validPassword = await bcrypt.compare(password, admin.password);
   if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

   const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expressIn: "1h" });

   res.json({ token });
}
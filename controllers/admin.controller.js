import bcrypt from "bcrypt";
import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

const Admin = db.Admin;

export const registerAdmin = async (req, res) => {
   const { username, password } = req.body;

   try {
      if (!username || !password) {
         return res.status(400).json({ message: "Username and password required." });
      }

      const existing = await Admin.findOne({ where: { username } });
      if (existing) {
         return res.status(409).json({ message: "Admin already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await Admin.create({
         username,
         password: hashedPassword,
      });

      res.status(201).json({ message: "Admin created", id: newAdmin.id });
   } catch (err) {
      console.error("Error registering admin:", err.message);
      res.status(500).json({ message: "Server error" });
   }
};

export const loginAdmin = async (req, res) => {
   const { username, password } = req.body;

   try {
      const admin = await db.Admin.findOne({ where: { username } });

      if (!admin) {
         return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
         return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
         {
            id: admin.id, username: admin.username
         },
         process.env.SECRET_KEY,
         {
            expiresIn: "1h"
         }
      );

      res.json({ message: "Login Successful", token })
   } catch (err) {
      console.error("Login error", err.message);
      res.status(500).json({ message: "Server error" });
   }
}
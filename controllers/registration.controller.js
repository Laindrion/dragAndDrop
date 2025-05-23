import db from "../models/index.js"
import fs from "fs";
import path from "path";

const Registration = db.registration;

export const getRegistrants = async (req, res) => {
   const info = await Registration.findAll();
   res.json(info)
}

export const register = async (req, res) => {
   let uploadedFiles = [];
   const transaction = await db.sequelize.transaction();

   try {
      const {
         firstName, lastName, address,
         phone, postalCode, email,
         dob, country, position
      } = req.body

      const passportPhoto = req.files?.passportPhoto?.[0]?.filename || null;
      const profilePhoto = req.files?.profilePhoto?.[0]?.filename || null;

      // Track filenames for possible cleanup
      if (passportPhoto) uploadedFiles.push(passportPhoto);
      if (profilePhoto) uploadedFiles.push(profilePhoto);

      // Validation
      if (
         !firstName || !lastName || !email || !address ||
         !phone || !postalCode || !email ||
         !dob || !country || !position
      ) {
         throw new Error("You're missing one of the required fields.");
      }

      // Save to DB in transacton
      const user = await Registration.create({
         firstName, lastName, address,
         phone, postalCode, email,
         dob, country, position,
         passportPhoto, profilePhoto
      }, { transaction });

      await transaction.commit();
      res.status(201).json({ message: "Registered successfully", data: user });
   } catch (err) {
      await transaction.rollback();

      for (const filename of uploadedFiles) {
         const filePath = path.join("uploads", filename);

         fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
               console.error(`Failed to delete ${filename}`, unlinkErr);
            }
         });
      }

      console.error("Error registering user:", err);
      res.status(500).json({ message: "Server error" });
   }
}
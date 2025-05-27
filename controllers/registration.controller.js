import db from "../models/index.js"
import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/sendEmail.js";

const Registration = db.registration;

export const getRegistrants = async (req, res) => {
   try {
      const info = await Registration.findAll();
      console.log("👥 Retrieved registrants:", info.length);
      res.json(info)
   } catch (err) {
      console.error("❌ Failed to fetch registrants:", err.message);
      res.status(500).json({ message: "Error retrieving registrants" });
   }
}

export const register = async (req, res) => {
   let uploadedFiles = [];
   const transaction = await db.sequelize.transaction();

   try {
      const {
         firstName, lastName, address,
         phone, postalCode, email,
         dob, country, position, status,
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
         !dob || !country || !position || status !== "pending"
      ) {
         throw new Error("You're missing one of the required fields.");
      }

      console.log("📝 Creating registration for:", email);

      // Save to DB in transacton
      const user = await Registration.create({
         firstName, lastName, address,
         phone, postalCode, email,
         dob, country, position,
         passportPhoto, profilePhoto, status: "pending",
      }, { transaction });

      await transaction.commit();
      try {
         await sendEmail(
            email,
            "Registration Confirmation",
            `
         <p>Dear ${firstName},</p>
         <p>Your registration has been successfully received.</p>
         <p>Please wait for further instructions regarding your application.</p>
         <p>Thank you!</p>
         `
         );
      } catch (err) {
         console.error("❌ Email failed, but user saved:", err.message);
      }


      console.log("📬 Email sent to:", email);


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

export const updateRegistrant = async (req, res) => {
   try {
      const { id } = req.params;
      const registrant = await Registration.findByPk(id);

      if (!registrant) {
         return res.status(404).json({ message: "Registrant not found" });
      }

      const {
         firstName, lastName, address,
         phone, postalCode, email,
         dob, country, position
      } = req.body

      const newPassportPhoto = req.files?.passportPhoto?.[0]?.filename;
      const newProfilePhoto = req.files?.profilePhoto?.[0]?.filename;

      // Delete old passport photo if replaced
      if (newPassportPhoto || registrant.passportPhoto) {
         fs.unlink(path.join("uploads", registrant.passportPhoto), err => {
            if (err) console.error("Error deleting old passport photo", err);
         });
      }

      // Delete old profile photo if replaced 
      if (newProfilePhoto || registrant.profilePhoto) {
         fs.unlink(path.join("uploads", registrant.passportPhoto), err => {
            if (err) console.error("Error deleting old passport photo", err);
         });
      }


      await registrant.update({
         firstName,
         lastName,
         address,
         phone,
         postalCode,
         email,
         dob,
         country,
         position,
         passportPhoto: newPassportPhoto || registrant.passportPhoto,
         profilePhoto: newProfilePhoto || registrant.profilePhoto,
      })

      res.json({ message: "Registrant updated", data: registrant });
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

export const deleteRegistrant = async (req, res) => {
   try {
      const { id } = req.params;
      const registrant = await Registration.findByPk(id);
      if (!registrant) {
         res.status(404).json({ message: "Registrant not found" });
      }

      //Delete uploaded images if exist
      const filesToDelete = [registrant.passportPhoto, registrant.profilePhoto];

      filesToDelete.forEach((filename) => {
         if (filename) {
            const filePath = path.join("uploads", filename);
            fs.unlink(filePath, (err) => {
               if (err) console.error(`Error deleting file: ${filename}`, err);
            })
         }
      });

      await registrant.destroy();
      res.json({ message: "Registrant deleted" });
   } catch (error) {
      res.status(500).json({ message: err.message });
   }
}

export const approveRegistrant = async (req, res) => {
   const { id } = req.params;
   const registrant = await Registration.findByPk(id);
   if (!registrant) {
      res.status(404).json({ message: "Registrant not found" });
   }

   await sendEmail(
      registrant.email,
      "Registration Approved",
      `
      <p>Dear ${registrant.firstName},</p>
      <p>We are pleased to inform you that your registration has been approved.</p>
      `
   );

   res.json({ message: "Registrant approved", data: registrant });
}

export const declineRegistrant = async (req, res) => {
   const { id } = req.params;
   const registrant = await Registration.findByPk(id);
   if (!registrant) {
      res.status(404).json({ message: "Registrant not found" });
   }

   await sendEmail(
      registrant.email,
      "Registration Declined",
      `
      <p>Dear ${registrant.firstName},</p>
      <p>We regret to inform you that your registration has been declined.</p>
      `
   );

   res.json({ message: "Decline email sent" });
}
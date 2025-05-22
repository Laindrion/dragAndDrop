import db from "../models/index.js"

const Registration = db.registration;

export const register = async (req, res) => {
   try {
      const {
         name, surname, phone, email, dob, country, position
      } = req.body

      const passportPhoto = req.files?.passportPhoto?.[0]?.filename || null;
      const profilePhoto = req.files?.profilePhoto?.[0]?.filename || null;

      const user = await Registration.create({
         name, surname, phone, email, dob, country, postition,
         passportPhoto, profilePhoto
      });

      res.satus(201).json({ message: "Registered successfully", data: user });

   } catch (err) {
      console.error("Error registering user: ", err);
      res.status(500).json({ message: "Server error" })
   }
}
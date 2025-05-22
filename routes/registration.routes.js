import express from "express"
import multer from "multer"
import { register } from "../controllers/registration.controller.js"

const router = express.Router();

const storage = multer.diskStorage({
   destination: (req, file, cb) => cb(null, "uploads/"),
   filename: (req, file, cb) =>
      cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

router.post(
   "/register",
   upload.fields([{ name: "passportPhoto" }, { name: "profilePhoto" }])
)

export default router;
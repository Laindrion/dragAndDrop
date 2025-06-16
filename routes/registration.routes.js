import Router from "express"
import multer from "multer"
import {
   register,
   getRegistrants,
   updateRegistrant,
   deleteRegistrant,
   approveRegistrant,
   declineRegistrant,
   getRegistrantById

} from "../controllers/registration.controller.js";

const router = Router();

const storage = multer.diskStorage({
   destination: (req, file, cb) => cb(null, "uploads/"),
   filename: (req, file, cb) =>
      cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({
   storage,
   limits: {
      fileSize: 2 * 1024 * 1024, // 2mb size limit
   },
   fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
         return cb(new Error("Only image files are allowed!", false));
      }
      cb(null, true);
   }
});

router.get("/", getRegistrants);
router.get("/:id", getRegistrantById);
router.post(
   "/",
   upload.fields([{ name: "passportPhoto" }, { name: "profilePhoto" }]),
   register
)
router.put("/:id", upload.fields([
   { name: "passportPhoto" },
   { name: "profilePhoto" }
]),
   updateRegistrant)
router.delete("/:id", deleteRegistrant)

router.post("/:id/approve", approveRegistrant);
router.post("/:id/decline", declineRegistrant);

export default router;
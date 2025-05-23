import { Router } from "express";
import {
   getCountries,
   addCountry,
   updateCountry,
   deleteCountry
} from "../controllers/country.controller.js";
const router = Router();

router.get("/", getCountries);
router.post("/", addCountry);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

export default router;
import express from "express";
import { createLandingPage } from "../controllers/landing.controller.js";

const router = express.Router();

router.post("/landing-pages", createLandingPage);

export default router;

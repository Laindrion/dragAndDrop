import { Router } from "express"
import {
   getPositions,
   addPosition,
   updatePosition,
   deletePosition,
} from "../controllers/position.controller.js"
const router = Router();

router.get("/", getPositions);
router.post("/", addPosition);
router.put("/:id", updatePosition);
router.delete("/:id", deletePosition);

export default router;
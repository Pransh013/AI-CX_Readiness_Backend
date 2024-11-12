import express from "express";
import {
  saveAIMarksController,
  saveCXMarksController,
  getAIMarksController,
  getCXMarksController,
} from "../controllers/marksController";

const router = express.Router();

router.post("/ai", saveAIMarksController);
router.post("/cx", saveCXMarksController);
router.get("/ai/:userId", getAIMarksController);
router.get("/cx/:userId", getCXMarksController);

export { router as marksRouter };

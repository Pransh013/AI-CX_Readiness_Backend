import express from "express";
import { getAIQuestionsController, getCXQuestionsController } from "../controllers/getQuestionsController";

const router = express.Router();

router.get("/ai/:role", getAIQuestionsController);
router.get("/cx/:role", getCXQuestionsController);

export { router as questionRouter };

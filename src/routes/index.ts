import express from "express";
import { userRouter } from "./userRoutes";
import { questionRouter } from "./questionRoutes";
import { marksRouter } from "./marksRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/questions", questionRouter);
router.use("/marks", marksRouter);

export default router;

import express from "express";
import { userRouter } from "./userRoutes";
import { userDetailsRouter } from "./userDetailsRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", userDetailsRouter);

export default router;

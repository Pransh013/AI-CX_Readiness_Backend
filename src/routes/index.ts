import express from "express";
import { userRouter } from "./userRoutes";
import { questionRouter } from "./questionRoutes";
import { marksRouter } from "./marksRoutes";
import { delegateRouter } from "./delegateRoutes";
import { invitedMemberRouter } from "./invitedMemberRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/questions", questionRouter);
router.use("/marks", marksRouter);
router.use("/delegations", delegateRouter);
router.use("/invited-members", invitedMemberRouter);

export default router;

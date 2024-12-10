import express from "express";
import getInvitedMembersController from "../controllers/getInvitedMembersController";

const router = express.Router();

router.get("/:managerId", getInvitedMembersController);

export { router as invitedMemberRouter };

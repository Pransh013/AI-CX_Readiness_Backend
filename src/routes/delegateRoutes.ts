import express from "express";
import delegateEmployeesController from "../controllers/delegateEmployeesController";

const router = express.Router();

router.post("/", delegateEmployeesController);

export { router as delegateRouter };

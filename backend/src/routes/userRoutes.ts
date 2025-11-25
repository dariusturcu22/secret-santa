import { Router } from "express";
import { getUserByClerkId } from "../controller/userController";

const router = Router();

router.get("/:clerkId", getUserByClerkId);

export default router;

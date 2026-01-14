import { Router } from "express";
import { createUsersInformation } from "../controllers/usersInformation.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/information", createUsersInformation);

// router.get("/users", verifyToken, getUsers);
export default router;

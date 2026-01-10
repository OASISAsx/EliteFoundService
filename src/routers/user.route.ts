import { Router } from "express";
import { getUsers, login, register } from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/users", getUsers);
router.post("/register", register);
router.post("/login", login); // ต้องมี token
// router.get("/users", verifyToken, getUsers);
export default router;

import { Router } from "express";
import { getUsers, login, register } from "../controllers/user.controller";

const router = Router();

router.get("/users", getUsers);
router.post("/register", register);
router.post("/login", login);
export default router;

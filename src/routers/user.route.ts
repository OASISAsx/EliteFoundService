import { Router } from "express";
import {
  getUsers,
  login,
  register,
  loginGoogle,
  findOne,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/usersAll", getUsers);
router.post("/register", register);
router.post("/login", login); // ต้องมี token
// router.post("/Information", createAbout);
router.post("/loginGoogle", loginGoogle);
router.post("/user/:id", verifyToken, findOne);
// router.get("/users", verifyToken, getUsers);
export default router;

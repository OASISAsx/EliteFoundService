import { Router } from "express";
import {
  getUsers,
  login,
  register,
  loginGoogle,
  findOne,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";
import { authorize } from "../middleware/authorize";
import { verifySignature } from "../middleware/verifySignature";
import { decryptPayload } from "../middleware/decryptPayload";

const router = Router();

router.post(
  "/usersAll",
  verifyToken,
  authorize(["ADMIN"]),
  verifySignature,
  decryptPayload,
  getUsers,
);

router.post("/register", register);
router.post("/login", login);
// router.post("/Information", createAbout);
router.post("/loginGoogle", loginGoogle);
router.post("/user/:id", verifyToken, findOne);
// router.get("/users", verifyToken, getUsers);
export default router;

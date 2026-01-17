import { Router } from "express";
import {
  createUsersInformation,
  update,
} from "../controllers/usersInformation.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/information", createUsersInformation);
router.put("/information/:id", update);
// router.get("/users", verifyToken, getUsers);
export default router;

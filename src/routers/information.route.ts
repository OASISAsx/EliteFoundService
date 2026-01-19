import { Router } from "express";
import {
  findOne,
  createUsersInformation,
  update,
} from "../controllers/usersInformation.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/information", createUsersInformation);
router.get("/information/:id", findOne);
router.put("/information/:id", update);
// router.get("/users", verifyToken, getUsers);
export default router;

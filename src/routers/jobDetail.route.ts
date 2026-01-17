import { Router } from "express";

import { verifyToken } from "../middleware/verifyToken";
import { create, update } from "../controllers/jobDetail.controller";

const router = Router();

router.post("/jobDetail", create);
router.put("/jobDetail/:id", update);
// router.get("/jobDetail", verifyToken, getUsers);
export default router;

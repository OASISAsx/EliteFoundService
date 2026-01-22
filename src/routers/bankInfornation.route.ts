import { Router } from "express";

import {
  create,
  update,
  findOne,
} from "../controllers/bankInformation.controller";

const router = Router();

router.post("/BankInformation", create);
router.get("/BankInformation/:usersInformationId", findOne);
router.put("/BankInformation/:id", update);
// router.get("/jobDetail", verifyToken, getUsers);
export default router;

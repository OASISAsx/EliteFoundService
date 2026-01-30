// routes/loanApplication.route.ts
import { Router } from "express";
import {
  createLoanContact,
  findOneContactLoan,
  updateStatusByAdmin,
  findAllUserContactLoan,
  getUsersLoan,
} from "../controllers/loanContract.controller";
import { verifyToken } from "../middleware/verifyToken";
import { authorize } from "../middleware/authorize";
import { verifySignature } from "../middleware/verifySignature";
import { decryptPayload } from "../middleware/decryptPayload";

const router = Router();

router.post(
  "/loanContactAll",
  verifyToken,
  authorize(["ADMIN"]),
  verifySignature,
  decryptPayload,
  getUsersLoan,
);
router.post("/loanContact", createLoanContact);
router.get("/loanContact", findAllUserContactLoan);
router.get("/loanContact/:id", findOneContactLoan);
router.put("/loanContactUpdate/:id", updateStatusByAdmin);

export default router;

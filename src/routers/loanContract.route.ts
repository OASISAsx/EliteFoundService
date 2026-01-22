// routes/loanApplication.route.ts
import { Router } from "express";
import {
  createLoanContact,
  findOneContactLoan,
  updateStatusByAdmin,
} from "../controllers/loanContract.controller";

const router = Router();

router.post("/loanContact", createLoanContact);
router.post("/loanContactUpdate", updateStatusByAdmin);
router.get("/loanContact/:id", findOneContactLoan);

export default router;

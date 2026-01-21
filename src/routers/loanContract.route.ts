// routes/loanApplication.route.ts
import { Router } from "express";
import {
  createLoanContact,
  findOneContactLoan,
} from "../controllers/loanContract.controller";

const router = Router();

router.post("/loanContact", createLoanContact);
router.get("/loanContact", findOneContactLoan);

export default router;

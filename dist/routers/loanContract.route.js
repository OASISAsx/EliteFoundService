"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/loanApplication.route.ts
const express_1 = require("express");
const loanContract_controller_1 = require("../controllers/loanContract.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const authorize_1 = require("../middleware/authorize");
const verifySignature_1 = require("../middleware/verifySignature");
const decryptPayload_1 = require("../middleware/decryptPayload");
const router = (0, express_1.Router)();
router.post("/loanContactAll", verifyToken_1.verifyToken, (0, authorize_1.authorize)(["ADMIN"]), verifySignature_1.verifySignature, decryptPayload_1.decryptPayload, loanContract_controller_1.getUsersLoan);
router.post("/loanContact", loanContract_controller_1.createLoanContact);
router.post("/loanContactUpdate", loanContract_controller_1.updateStatusByAdmin);
router.get("/loanContact", loanContract_controller_1.findAllUserContactLoan);
router.get("/loanContact/:id", loanContract_controller_1.findOneContactLoan);
exports.default = router;

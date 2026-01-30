"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobDetail_controller_1 = require("../controllers/jobDetail.controller");
const router = (0, express_1.Router)();
router.post("/jobDetail", jobDetail_controller_1.create);
router.put("/jobDetail/:id", jobDetail_controller_1.update);
// router.get("/jobDetail", verifyToken, getUsers);
exports.default = router;

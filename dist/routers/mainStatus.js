"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/mail.route.ts
const express_1 = __importDefault(require("express"));
const statusMain_service_1 = require("../services/statusMain.service");
const router = express_1.default.Router();
router.get("/status/:usersInformationId", statusMain_service_1.MainStatus);
exports.default = router;

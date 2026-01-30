"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const thaiGeo_controller_1 = require("../controllers/thaiGeo.controller");
const router = express_1.default.Router();
router.get("/provinces", thaiGeo_controller_1.provices);
router.get("/districts", thaiGeo_controller_1.district);
router.get("/subdistricts", thaiGeo_controller_1.subdistrict);
exports.default = router;

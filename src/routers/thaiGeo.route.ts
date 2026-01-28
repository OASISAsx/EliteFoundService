import express from "express";
import {
  district,
  provices,
  subdistrict,
} from "../controllers/thaiGeo.controller";
const router = express.Router();

router.get("/provinces", provices);
router.get("/districts", district);
router.get("/subdistricts", subdistrict);

export default router;

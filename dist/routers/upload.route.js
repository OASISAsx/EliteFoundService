"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middleware/multer");
const upload_controller_1 = require("../controllers/upload.controller");
const router = (0, express_1.Router)();
router.post("/test", multer_1.upload.single("file"), (req, res) => {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    res.json({
        file: req.file,
        body: req.body,
    });
});
router.post("/single", multer_1.upload.single("file"), upload_controller_1.singleUpload);
router.post("/multi", multer_1.upload.array("files", 10), upload_controller_1.multiUpload);
exports.default = router;

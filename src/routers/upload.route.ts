import { Router } from "express";
import { upload } from "../middleware/multer";
import { singleUpload, multiUpload } from "../controllers/upload.controller";

const router = Router();

router.post("/test", upload.single("file"), (req, res) => {
  console.log("FILE:", req.file);
  console.log("BODY:", req.body);

  res.json({
    file: req.file,
    body: req.body,
  });
});
router.post("/single", upload.single("file"), singleUpload);
router.post("/multi", upload.array("files", 10), multiUpload);

export default router;

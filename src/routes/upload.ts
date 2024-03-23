import express from "express";
import uploadImages from "../controllers/uploadFiles";
import multer from "multer";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/upload").post(upload.single("images"), uploadImages);

export default router;

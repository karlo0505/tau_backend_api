import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname.toLowerCase() + "-" + Date.now() + path.extname(file.originalname.toLowerCase())
    );
  },
});
const maxSize = 5 * 1024 * 1024;
const whitelist = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

const multipleUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      cb(null, false);
      const err = new Error("Only .png, .jpg, .jpeg and pdf format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }

    cb(null, true);
  },
  limits: { fileSize: maxSize },
}).array("images", 8);

export default multipleUpload;

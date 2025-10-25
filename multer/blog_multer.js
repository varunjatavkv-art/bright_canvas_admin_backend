import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// 1. Get the current file path (fileURL)
const __filename = fileURLToPath(import.meta.url);
// 2. Get the directory name from the file path
const __dirname = path.dirname(__filename);


// Ensure uploads directory exists
export const UPLOAD_DIR = path.join(__dirname, "../uploads/posts");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });


// Multer storage and file filter
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, unique + ext);
    },
  });
  
  const allowedMime = ["image/jpeg", "image/png"];
  const allowedExt = [".jpg", ".jpeg", ".png"];
  
  function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg and .png files are allowed"));
    }
  }
  
export const upload = multer({ storage, fileFilter });
  
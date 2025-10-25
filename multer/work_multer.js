import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// 1. Get the current file path (fileURL)
const __filename = fileURLToPath(import.meta.url);
// 2. Get the directory name from the file path
const __dirname = path.dirname(__filename);


export const WORK_DIR = path.join(__dirname, "../uploads/work");
if (!fs.existsSync(WORK_DIR)) fs.mkdirSync(WORK_DIR, { recursive: true });

// Multer storage and file filter
const work_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, WORK_DIR);
    },
    filename: function (req, file, cb) {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, unique + ext);
    },
  });
  
  const allowedWorkMime = ["image/jpeg", "image/png"];
  const allowedWorkExt = [".jpg", ".jpeg", ".png"];
  
  function workFileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedWorkMime.includes(file.mimetype) && allowedWorkExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg and .png files are allowed"));
    }
  }
  
  export const work = multer({ storage: work_storage, fileFilter: workFileFilter });
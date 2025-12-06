import express from "express";
import { db } from "./db.js";
import cors from "cors";

import { initializeApp } from "firebase-admin/app";
import InvoiceRouter from "./routes/invoiceRouter.js";
import blogRouter from "./routes/blogRouter.js";
import workRouter from "./routes/workRouter.js";
import { WORK_DIR } from "./multer/work_multer.js";
import { UPLOAD_DIR } from "./multer/blog_multer.js";
import { INVOICE_DIR } from "./controller/invoiceController.js";


const adminApp = initializeApp(); 

const app = express();

app.use(
  cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://bright-canvas.web.app"],
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.options("/api/blogs", cors());
app.options("/api/work", cors());


app.use("/uploads/posts", express.static(UPLOAD_DIR));
app.use("/uploads/work", express.static(WORK_DIR));
app.use("/invoice_pdf", express.static(INVOICE_DIR));

app.use("/api/blogs", blogRouter);
app.use("/api/work", workRouter);
app.use("/api/invoice", InvoiceRouter);

export default app;
import express from "express";
import {db} from "./db.js";
import cors from "cors";

// firebase 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// create Invoice
// import { createInvoice }  from "./createInvoice.js";
import InvoiceRouter from "./routes/invoiceRouter.js";
import blogRouter from "./routes/blogRouter.js";
import workRouter from "./routes/workRouter.js";
import { WORK_DIR } from "./multer/work_multer.js";
import { UPLOAD_DIR } from "./multer/blog_multer.js";
import { INVOICE_DIR } from "./controller/invoiceController.js";


const app = express();

const firebaseConfig = {
  // NOTE: It's best practice to use environment variables for keys, 
  // but for deployment, Firebase auto-configures this for you in the function environment.
  apiKey: "AIzaSyCG7BUnbHAXwRSTlSa1skYwiVNn3UfClOM",
  authDomain: "bright-canvas.firebaseapp.com",
  projectId: "bright-canvas",
  storageBucket: "bright-canvas.firebasestorage.app",
  messagingSenderId: "936321009950",
  appId: "1:936321009950:web:22026d3e907da000cf210f",
  measurementId: "G-V6Q31JPDHZ"
};

const firebaseapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseapp);

// cors setting
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// cors implementation
app.options("/api/blogs", cors());
app.options("/api/work", cors());


// file to fetch
app.use("/uploads/posts", express.static(UPLOAD_DIR));
app.use("/uploads/work", express.static(WORK_DIR));
app.use("/invoice_pdf", express.static(INVOICE_DIR));

// routers
app.use("/api/blogs", blogRouter);
app.use("/api/work", workRouter);
app.use("/api/invoice", InvoiceRouter);


// --- REMOVED: app.listen and PORT initialization ---
// In Firebase Functions, the server is started by the platform, not by app.listen.
// The database connection logic will run at the module level before the first request, 
// which is typically acceptable for serverless environments.

// --- EXPORT THE EXPRESS APP ---
// This is the critical line that allows index.js to use this application.
module.exports = app;
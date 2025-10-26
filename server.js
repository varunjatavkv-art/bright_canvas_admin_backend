import express from "express";
import {db} from "./db.js";
import cors from "cors";

// create Invoice
// import { createInvoice }  from "./createInvoice.js";
import  InvoiceRouter from "./routes/invoiceRouter.js";
import blogRouter from "./routes/blogRouter.js";
import workRouter from "./routes/workRouter.js";
import { WORK_DIR } from "./multer/work_multer.js";
import { UPLOAD_DIR } from "./multer/blog_multer.js";
import { INVOICE_DIR } from "./controller/invoiceController.js";


const app = express();




// cors setting
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"], // Add other methods you might need
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



const PORT = process.env.PORT || 8000;

// Start server after successful DB connection
db.connectWithRetry()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB, exiting", err);
    process.exit(1);
  });

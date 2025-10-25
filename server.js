import express from "express";


import {db} from "./db.js";

import cors from "cors";
// create Invoice
import { createInvoice }  from "./createInvoice.js";
import  InvoiceRouter from "./routes/invoiceRouter.js";
import blogRouter from "./routes/blogRouter.js";
import workRouter from "./routes/workRouter.js";
import { WORK_DIR } from "./multer/work_multer.js";
import { UPLOAD_DIR } from "./multer/blog_multer.js";

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

// routers
app.use("/api/blogs", blogRouter);
app.use("/api/work", workRouter);
app.use("/api/invoice", InvoiceRouter);

const invoice = {
  shipping: {
    name: 'John Doe',
    address: '1234 Main Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    postal_code: 94111,
  },
  items: [
    {
      item: 'TC 100',
      description: 'Toner Cartridge',
      quantity: 2,
      amount: 6000,
    },
    {
      item: 'USB_EXT',
      description: 'USB Cable Extender',
      quantity: 1,
      amount: 2000,
    },
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
};

createInvoice(invoice, 'invoice_pdf/invoice.pdf');

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

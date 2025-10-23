import express from "express";
import { addInvoice, getInvoice } from "../controller/invoiceController.js";

const InvoiceRouter = express.Router();


InvoiceRouter.post('', addInvoice);
InvoiceRouter.get('', getInvoice);

export default InvoiceRouter;
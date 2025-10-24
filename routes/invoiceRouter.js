import express from "express";
import { addInvoice, deleteInvoice, getInvoice } from "../controller/invoiceController.js";

const InvoiceRouter = express.Router();


InvoiceRouter.post('', addInvoice);
InvoiceRouter.get('', getInvoice);
InvoiceRouter.delete('/:id', deleteInvoice);
export default InvoiceRouter;
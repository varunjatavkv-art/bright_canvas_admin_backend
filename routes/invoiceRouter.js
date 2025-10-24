import express from "express";
import { addInvoice, deleteInvoice, getInvoice, getSingleInvoice } from "../controller/invoiceController.js";

const InvoiceRouter = express.Router();


InvoiceRouter.post('', addInvoice);
InvoiceRouter.get('', getInvoice);
InvoiceRouter.delete('/delete/:id', deleteInvoice);
InvoiceRouter.get('/single/:id', getSingleInvoice);
export default InvoiceRouter;
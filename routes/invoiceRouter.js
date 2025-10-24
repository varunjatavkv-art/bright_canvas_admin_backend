import express from "express";
import { addInvoice, deleteInvoice, getInvoice, getSingleInvoice, updateInvoice } from "../controller/invoiceController.js";

const InvoiceRouter = express.Router();


InvoiceRouter.post('', addInvoice);
InvoiceRouter.get('', getInvoice);
InvoiceRouter.delete('/delete/:id', deleteInvoice);
InvoiceRouter.get('/single/:id', getSingleInvoice);
InvoiceRouter.put('/update/:id', updateInvoice);
export default InvoiceRouter;
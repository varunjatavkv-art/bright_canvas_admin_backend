import express from "express";
import { addInvoice } from "../controller/invoiceController.js";

const addInvoiceRouter = express.Router();

addInvoiceRouter.post('', addInvoice);

export default addInvoiceRouter;
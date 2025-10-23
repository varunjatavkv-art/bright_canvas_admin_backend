const invoice = require("../models/invoice");

const addInvoice = async (req,res) => {
  try {
    const doc = await invoice.create(
        req.body
    )
    res.status(201).json(doc);
  } catch (error) {
    console.log("error: ", err);
    res.status(400).json({ error: err.message });
  }
}

const getInvoice = async(req,res) => {
    try {
        const invoices = await invoice.find();
        res.json(invoices)
    } catch (error) {
        console.log("error: ", err);
        res.status(400).json({ error: err.message });
    }
}
module.exports = { addInvoice , getInvoice };
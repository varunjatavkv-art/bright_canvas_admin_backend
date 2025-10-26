import path from "path";
import { fileURLToPath } from "url";
import { createInvoice } from "../createInvoice.js";
import { invoice } from "../models/invoice.js";
import fs from "fs";


// 1. Get the current file path (fileURL)
const __filename = fileURLToPath(import.meta.url);
// 2. Get the directory name from the file path
const __dirname = path.dirname(__filename);


export const INVOICE_DIR = path.join(__dirname, "../invoice_pdf");
if (!fs.existsSync(INVOICE_DIR)) fs.mkdirSync(INVOICE_DIR, { recursive: true });

export const addInvoice = async (req, res) => {
  try {
    const doc = await invoice.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    // Convert query parameters to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // 2. Build the search query filter
    let filter = {};
    if (search) {
      // Create a case-insensitive regular expression for searching
      const searchRegex = new RegExp(search, "i");

      // Use $or to search across multiple fields (e.g., customer name or invoice number)
      filter = {
        $or: [
          { "customer.name": searchRegex },
          { "metadata.invoiceNumber": searchRegex },
        ],
      };
    }
    if (status == "-1") {
      res.status(404).json({ error: "Please Select a Status" });
    }
    if (status) {
      filter["summary.status"] = status;
    }

    // 3. Get the total count of documents matching the filter (for totalPages calculation)
    const totalItems = await invoice.countDocuments(filter);

    // 4. Fetch the paginated and filtered data
    const invoices = await invoice
      .find(filter)
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // 5. Send the response with data and pagination metadata
    res.json({
      data: invoices,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalItems / limitNumber),
      totalItems: totalItems,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const result = await invoice.deleteOne({ _id: req.params.id });
    if (result.deleteCount === 0) {
      // res.status(200).json({message: "Invoice Deleted Successfully"});
      console.log("Invoice not found");
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingleInvoice = async (req, res) => {
  try {
    const result = await invoice.findOne({ _id: req.params.id });
    if (!result) {
      console.log("Invoice not found");
      return res.status(404).json({ error: "No single Invoice is found" });
    };
    createInvoice(result,`./invoice_pdf/invoice_${result?.metadata?.invoiceNumber}.pdf`)
    res.status(200).json({ message: "Got single Invoice", data: result });
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  // console.log(req.body);
  try {
    // 1. Create the new item object from the request body

    const updatedItemsArray = req.body.items;
    
    const newCustomer = {
      name: req.body.customer.name,
      address: req.body.customer.address,
      phone: req.body.customer.phone,
    };

    const newSummary = {
      subtotal: req.body.summary?.subtotal,
      total: req.body.summary?.total,
      tax: req.body.summary?.tax,
      status: req.body.summary?.status,
    };
    const newMetaData = {
      issueDate: req.body.metadata?.issueDate,
      dueDate: req.body.metadata?.dueDate,
      invoiceNumber: req.body.metadata?.invoiceNumber,
      orderID: req.body.metadata?.orderID,
      shipmentID: req.body.metadata?.shipmentID,
    };
    // 2. Use $push to add the new item to the 'items' array
    const result = await invoice.updateOne(
      { _id: req.params.id }, // Filter to find the invoice
      {
        $set: {
          customer: newCustomer,
          items: updatedItemsArray,
          summary: newSummary,
          metadata: newMetaData,
        },
      }, // Update operation
      { upsert: true }
    );

    // 3. Correctly check if the invoice was found
    if (result.matchedCount === 0) {
      console.log("Invoice not found for updation");
      return res
        .status(404)
        .json({ error: "No single Invoice is found for updation" });
    }

    res.status(200).json({ message: "Invoice Updated", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const downloadInvoice = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(INVOICE_DIR, fileName);

  // CRITICAL FIX: Set Content-Disposition header to 'attachment'
  res.download(filePath, (err) => {
      if (err) {
          // Handle error, file might not exist
          console.error("Error downloading file:", err);
          res.status(404).send("Invoice not found or error occurred.");
      }
  });
}
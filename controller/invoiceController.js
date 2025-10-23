const invoice = require("../models/invoice");

const addInvoice = async (req,res) => {
  try {
    const doc = await invoice.create(
        req.body
    )
    res.status(201).json(doc);
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}

const getInvoice = async(req,res) => {

    try {
        const {  page = 1, limit = 10, search = '', status = ""} = req.query;
      // Convert query parameters to numbers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      
      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * limitNumber;

      // 2. Build the search query filter
      let filter = {};
      if (search) {
          // Create a case-insensitive regular expression for searching
          const searchRegex = new RegExp(search, 'i');
          
          // Use $or to search across multiple fields (e.g., customer name or invoice number)
          filter = {
              $or: [
                  { 'customer.name': searchRegex },
                  { 'metadata.invoiceNumber': searchRegex }
              ]
          };
      }
      if(status == "-1"){
        res.status(404).json({error: "Please Select a Status"})
      }
      if (status) {
        filter['summary.status'] = status;
    }

      // 3. Get the total count of documents matching the filter (for totalPages calculation)
      const totalItems = await invoice.countDocuments(filter);

      // 4. Fetch the paginated and filtered data
      const invoices = await invoice.find(filter)
          .skip(skip)
          .limit(limitNumber)
          .exec();

      // 5. Send the response with data and pagination metadata
      res.json({
          data: invoices,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalItems / limitNumber),
          totalItems: totalItems
      });
    } catch (error) {
        console.log("error: ", error);
        res.status(400).json({ error: error.message });
    }
}
module.exports = { addInvoice , getInvoice };
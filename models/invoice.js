const mongoose  = require('mongoose');

const invoiceSchema = mongoose.Schema({
    customer: {
        address: {
            type: String, required: true, default: ''
        },
        name: {
             type: String, required: true, default: ''
        },
        phone: {
            type: String, required: true, default: ''
        }
    }, 
    items : [
        {
            description: {
                type: String, required: true, default: ''
            },
            id: {
                type: String, required: true, default: ''
            },
            qty: {
                type: Number, required: true, default: 1
            },
            serial: {
                type: Number, required: true, default: 1
            },
            unit: {
                type: String, required: true, default: "-1"
            },
            unitPrice: {
                type: Number, required: true, default: 0
            },
        }
    ], 
    metadata : {
        dueDate: { type: Date, required: true, default: 0 },
        invoiceNumber: {type: String, required: true, default: "" },
        issueDate: { type:Date, required:true, default: Date.now() }, 
        orderID: { type: String, required: true, default:"" },
        shipmentID: { type: String, required: true, default:"" }
    },
    summary : {
        subtotal: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true, default: 0 },
        tax: { type: Number, required: true, default: 0 }
    }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
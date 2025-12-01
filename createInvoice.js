import fs from 'fs';
import PDFDocument from 'pdfkit';
import { formatDate } from './commonFunction/common.functions.js';
import path from 'path'; 
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- CONSTANTS & HELPERS ---
const MARGIN = 50;
const PAGE_WIDTH = 612; // A4 width in points
const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN); // 512
const TEXT_COLOR = '#2e2e2e';
const CURRENCY_SYMBOL = ''; 

const LOGO_PATH = path.join(__dirname, '..','backend', 'assets', 'images', 'logo', 'Logo BLACK.png'); 

const LOGO_WIDTH = 100; 
const LOGO_HEIGHT = 50; 

// Helper to format currency
const formatCurrency = (amount) => {
    const num = Number(String(amount).replace(/[^0-9.]/g, '')) || 0;
    return `${CURRENCY_SYMBOL}${num.toFixed(2)}`; 
};


const getStatusText = (status) => {
    return status === "0" ? "Pending" : (status === "1" ? "Paid" : "N/A");
};


export function createInvoice(invoice, path) {
    let doc = new PDFDocument({ margin: MARGIN });
    doc.pipe(fs.createWriteStream(path));
    
    try {
        drawInvoiceContent(doc, invoice); 

    } catch (error) {
        console.error(`CRITICAL PDF CRASH: Generation failed for invoice.`, error.message);
        doc.text('ERROR: Invoice rendering failed. See server logs.', 50, 50);

    } finally {
        doc.end();
    }
}


function drawInvoiceContent(doc, invoice) {
    let currentY = MARGIN; 
    
    doc.fillColor(TEXT_COLOR);
    doc.font('Helvetica');

    currentY = generateHeader(doc, currentY, invoice); 
    currentY = generateCustomerInfo(doc, currentY, invoice);
    currentY = generateInvoiceTable(doc, currentY, invoice);
    generateTotals(doc, currentY, invoice);
}

function generateHeader(doc, startY, invoice) {
    let currentY = startY; 
    const rightX = MARGIN + CONTENT_WIDTH;
    const RIGHT_ADJUSTMENT = 120; 

    try {
        doc.image(LOGO_PATH,  rightX - RIGHT_ADJUSTMENT, startY, { 
            width: LOGO_WIDTH, 
            height: LOGO_HEIGHT 
        });
        
        currentY = startY + LOGO_HEIGHT + 10;

    } catch (e) {
        console.error("Error loading logo image:", e);
        currentY = startY + 20; 
    }
    
    doc.fontSize(10)
        .font('Helvetica')
        .text('Bright Canvas', rightX - RIGHT_ADJUSTMENT, currentY, { align: 'left' })
        .text('bright.canvas@gmail.com, +1 543 2198', rightX - RIGHT_ADJUSTMENT, currentY + 15, { align: 'left' });

    const invoiceNum = invoice?.metadata?.invoiceNumber || invoice?._id?.toString().substring(0, 8) || 'N/A';

    let contentStartBelowLogoY = startY; 
    let contentStartBelowLogoY2 = currentY; 
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(`Invoice #${invoiceNum}`, MARGIN, contentStartBelowLogoY);

    contentStartBelowLogoY += 20;
    contentStartBelowLogoY2 += 20;

    doc.fontSize(10)
       .font('Helvetica')
       .text(`Date Issued: ${formatDate(invoice?.metadata?.issueDate) || 'N/A'}`, MARGIN, contentStartBelowLogoY)
       .text(`Date Due: ${formatDate(invoice?.metadata?.dueDate) || 'N/A'}`, MARGIN, contentStartBelowLogoY + 15);
    
    let finalY = Math.max(contentStartBelowLogoY2 + 35, startY + 40); 
    
    doc.strokeColor("#aaaaaa")
       .lineWidth(1)
       .moveTo(MARGIN, finalY)
       .lineTo(rightX, finalY)
       .stroke();
    
    return finalY + 20;
}

// ----------------------------------------------------------------------
function generateCustomerInfo(doc, startY ,invoice) {
    let currentY = startY; 
    const LEFT_COL_X = MARGIN; 
    const RIGHT_COL_X = MARGIN + CONTENT_WIDTH / 2 + 150;
    const VALUE_OFFSET = 80;
    const LINE_HEIGHT = 15;

    doc.fontSize(12).font('Helvetica-Bold').text('Issue For:', LEFT_COL_X, currentY);
    currentY += 20;
    doc.fontSize(10).font('Helvetica');

    // DYNAMIC LEFT COLUMN (using optional chaining)
    doc.text('Name:', LEFT_COL_X, currentY);
    doc.text(invoice?.customer?.name || 'N/A', LEFT_COL_X + VALUE_OFFSET, currentY); 

    doc.text('Address:', LEFT_COL_X, currentY + LINE_HEIGHT);
    doc.text(invoice?.customer?.address || 'N/A', LEFT_COL_X + VALUE_OFFSET, currentY + LINE_HEIGHT);

    doc.text('Phone Number:', LEFT_COL_X, currentY + (LINE_HEIGHT * 2));
    doc.text(invoice?.customer?.phone || 'N/A', LEFT_COL_X + VALUE_OFFSET, currentY + (LINE_HEIGHT * 2));

    // DYNAMIC RIGHT COLUMN (using optional chaining)
    let rightY = currentY;
    const RIGHT_VALUE_OFFSET = 60;

    doc.text('Status:', RIGHT_COL_X, rightY);
    doc.text(getStatusText(invoice?.summary?.status), RIGHT_COL_X + RIGHT_VALUE_OFFSET, rightY);

    doc.text('Order ID:', RIGHT_COL_X, rightY + LINE_HEIGHT);
    doc.text("#"+invoice?.metadata?.orderID || 'N/A', RIGHT_COL_X + RIGHT_VALUE_OFFSET, rightY + LINE_HEIGHT);

    doc.text('Shipment ID:', RIGHT_COL_X, rightY + (LINE_HEIGHT * 2));
    doc.text('#'+invoice?.metadata?.shipmentID || 'N/A', RIGHT_COL_X + RIGHT_VALUE_OFFSET, rightY + (LINE_HEIGHT * 2));

    currentY += (LINE_HEIGHT * 3) + 20; 
    doc.strokeColor("#aaaaaa")
       .lineWidth(1)
       .moveTo(MARGIN, currentY)
       .lineTo(MARGIN + CONTENT_WIDTH, currentY)
       .stroke();

    return currentY + 20;
}

// ----------------------------------------------------------------------
function generateInvoiceTable(doc, startY, invoice) {
   
    let currentY = startY;
    const HEADER_Y = currentY;
    const LINE_HEIGHT = 20;

    const columns = {
        SL: MARGIN + 5,
        Items: MARGIN + 40,
        Qty: MARGIN + 280,
        Units: MARGIN + 330,
        UnitPrice: MARGIN + 390,
        Price: MARGIN + 460,
    };
    const PRICE_WIDTH = 50; 

    // --- TABLE HEADER ---
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('SL.', columns.SL, HEADER_Y);
    doc.text('Items', columns.Items, HEADER_Y);
    doc.text('Qty', columns.Qty, HEADER_Y, { width: PRICE_WIDTH, align: 'right' });
    doc.text('Units', columns.Units, HEADER_Y);
    doc.text('Unit Price', columns.UnitPrice, HEADER_Y, { width: PRICE_WIDTH, align: 'right' });
    doc.text('Price', columns.Price, HEADER_Y, { width: PRICE_WIDTH, align: 'right' });

    currentY += LINE_HEIGHT + 5; 
    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(MARGIN, currentY).lineTo(MARGIN + CONTENT_WIDTH, currentY).stroke();
    currentY += 5;

    // --- TABLE ROWS (DYNAMIC) ---
    doc.font('Helvetica').fontSize(10);
    
    (invoice.items || []).forEach((item) => {
        // Calculate Line Item Total
        const unitPriceNum = Number(String(item.unitPrice).replace(/[^0-9.]/g, '')) || 0;
        const qtyNum = Number(item.qty) || 0;
        const lineItemTotal = formatCurrency(unitPriceNum * qtyNum); 

        // Use optional chaining for individual item properties
        doc.text(item?.serial, columns.SL, currentY);
        doc.text(item?.description, columns.Items, currentY);
        doc.text(item?.qty || '0', columns.Qty, currentY, { width: PRICE_WIDTH, align: 'right' });
        doc.text(item?.unit, columns.Units, currentY);
        
        // Format Unit Price for display
        doc.text(formatCurrency(item?.unitPrice), columns.UnitPrice, currentY, { width: PRICE_WIDTH, align: 'right' });
        
        // Display the calculated total price
        doc.text(lineItemTotal, columns.Price, currentY, { width: PRICE_WIDTH, align: 'right' }); 

        currentY += LINE_HEIGHT;
    });

    // Final line
    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(MARGIN, currentY).lineTo(MARGIN + CONTENT_WIDTH, currentY).stroke();

    return currentY + 15; 
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// --- 4. TOTALS & FOOTER SECTION (FIXED: Added Signatures) ---
// ----------------------------------------------------------------------
function generateTotals(doc, startY , invoice) {
    // We add extra space (e.g., 20) to the starting Y position to separate the totals from the table
    let currentY = startY + 20; 
    
    const LABEL_COL_X = MARGIN + 350; 
    const VALUE_COL_X = MARGIN + 460;
    const PRICE_WIDTH = 60;
    const LINE_SPACING = 15; // Standard vertical space between total lines
    const PAGE_BOTTOM_Y = 700; // Fixed Y position for signatures (approx 100 points from bottom)
    
    // --- Sales By: (Left Aligned) ---
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Sales By:', MARGIN, currentY);
    doc.font('Helvetica');
    doc.text(invoice?.salesperson || 'Siddhartha', MARGIN + 50, currentY); 
    
    // --- Totals (Right Aligned) ---
    currentY += 5; 

    // Subtotal
    doc.font('Helvetica-Bold');
    doc.text('Subtotal:', LABEL_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });
    doc.font('Helvetica');
    doc.text(formatCurrency(invoice?.summary?.subtotal), VALUE_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });
    
    currentY += LINE_SPACING;
    
    // Tax
    doc.font('Helvetica-Bold');
    doc.text('Tax (18%):', LABEL_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });
    doc.font('Helvetica');
    doc.text(formatCurrency(invoice?.summary?.tax), VALUE_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });
    
    currentY += LINE_SPACING; 
    
    // Total Separator
    doc.strokeColor("#000000")
       .lineWidth(1)
       .moveTo(LABEL_COL_X, currentY)
       .lineTo(MARGIN + CONTENT_WIDTH, currentY)
       .stroke();
       
    currentY += 5; 

    // Final Total
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Total:', LABEL_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });
    doc.text(formatCurrency(invoice?.summary?.total), VALUE_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });

    // --- Invoice Notes (Footer Message) ---
    currentY += 60; // Space below totals
    doc.fontSize(10).text(
      invoice?.notes || 'Thankyou for your purchase .',
        50, 
        currentY, 
        { align: 'center', width: CONTENT_WIDTH },
    );
    
    // -----------------------------------------------------
    // --- SIGNATURE BLOCKS ---
    // -----------------------------------------------------
    const LINE_LENGTH = 150;
    const LEFT_LINE_X = MARGIN;
    const RIGHT_LINE_X = MARGIN + CONTENT_WIDTH - LINE_LENGTH;
    const SIGNATURE_TEXT_Y = PAGE_BOTTOM_Y + 5;

    // 1. Signature of Customer (Left Side)
    doc.strokeColor("#000000")
       .lineWidth(1)
       .moveTo(LEFT_LINE_X, PAGE_BOTTOM_Y)
       .lineTo(LEFT_LINE_X + LINE_LENGTH, PAGE_BOTTOM_Y)
       .stroke();
       
    doc.font('Helvetica').fontSize(10).text('Signature of Customer', LEFT_LINE_X, SIGNATURE_TEXT_Y, {
        width: LINE_LENGTH,
        align: 'center'
    });

    // 2. Signature of Authorized (Right Side)
    doc.strokeColor("#000000")
       .lineWidth(1)
       .moveTo(RIGHT_LINE_X, PAGE_BOTTOM_Y)
       .lineTo(RIGHT_LINE_X + LINE_LENGTH, PAGE_BOTTOM_Y)
       .stroke();

    doc.font('Helvetica').fontSize(10).text('Signature of Authorized', RIGHT_LINE_X, SIGNATURE_TEXT_Y, {
        width: LINE_LENGTH,
        align: 'center'
    });
}
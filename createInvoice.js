import fs from 'fs';
import PDFDocument from 'pdfkit';

// --- IMPORTANTS ---
const MARGIN = 50;
const PAGE_WIDTH = 612; // A4 width in points
const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN); // 512
const TEXT_COLOR = '#2e2e2e'; 

// --- HELPER FUNCTION: Main Content Drawer ---
function drawInvoiceContent(doc) {
    let currentY = MARGIN; 
    
    // Set text color and default font
    doc.fillColor(TEXT_COLOR);
    doc.font('Helvetica');

    // Draw sections sequentially, updating Y position
    currentY = generateHeader(doc, currentY); 
    currentY = generateCustomerInfo(doc, currentY);
    currentY = generateInvoiceTable(doc, currentY);

    // Totals are drawn at the end of the content
    generateTotals(doc, currentY);
}

// ----------------------------------------------------------------------
// --- 1. HEADER SECTION (Invoice #, Dates, Company Info) ---
// ----------------------------------------------------------------------
function generateHeader(doc, startY) {
    let currentY = startY; 
    const rightX = MARGIN + CONTENT_WIDTH;

    // --- LEFT SIDE: Invoice #, Dates ---
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(`Invoice #${3492}`, MARGIN, currentY);

    currentY += 20; // Move down

    doc.fontSize(10)
       .font('Helvetica')
       .text(`Date Issued: ${'25/08/2020'}`, MARGIN, currentY)
       .text(`Date Due: ${'29/08/2020'}`, MARGIN, currentY + 15);
    
    // --- RIGHT SIDE: Company Address/Contact ---
    doc.fontSize(10)
       .text('4517 Washington Ave. Manchester, Kentucky 39495', rightX, startY, { align: 'right' })
       .text('random@gmail.com, +1 543 2198', rightX, startY + 15, { align: 'right' });

    // Draw a separator line
    currentY += 40;
    doc.strokeColor("#aaaaaa")
       .lineWidth(1)
       .moveTo(MARGIN, currentY)
       .lineTo(rightX, currentY)
       .stroke();
    
    // Return the new Y position for the next section
    return currentY + 20; // Extra space after header
}

// ----------------------------------------------------------------------
// --- 2. CUSTOMER INFO SECTION ("Issue For") ---
// ----------------------------------------------------------------------
function generateCustomerInfo(doc, startY) {
    let currentY = startY; 
    const LEFT_COL_X = MARGIN; 
    const RIGHT_COL_X = MARGIN + CONTENT_WIDTH / 2;
    const VALUE_OFFSET = 80; // Distance to push values from their labels
    const LINE_HEIGHT = 15;

    // --- Draw the "Issue For" Box/Title ---
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Issue For:', LEFT_COL_X, currentY);

    currentY += 20; // Move down after title

    // Reset font to regular for details
    doc.fontSize(10).font('Helvetica');

    // --- LEFT COLUMN: Name, Address, Phone ---
    doc.text('Name:', LEFT_COL_X, currentY);
    doc.text(':Will Marthas', LEFT_COL_X + VALUE_OFFSET, currentY); 

    doc.text('Address:', LEFT_COL_X, currentY + LINE_HEIGHT);
    doc.text(':4517 Washington Ave.USA', LEFT_COL_X + VALUE_OFFSET, currentY + LINE_HEIGHT);

    doc.text('Phone Number:', LEFT_COL_X, currentY + (LINE_HEIGHT * 2));
    doc.text(':+1 543 2198', LEFT_COL_X + VALUE_OFFSET, currentY + (LINE_HEIGHT * 2));


    // --- RIGHT COLUMN: Issue Date, Order ID, Shipment ID ---
    let rightY = currentY;
    const RIGHT_VALUE_OFFSET = 60; // Less offset on the right

    doc.text('Issue Date:', RIGHT_COL_X, rightY);
    doc.text(':25 Jan 2024', RIGHT_COL_X + RIGHT_VALUE_OFFSET, rightY);

    doc.text('Order ID:', RIGHT_COL_X, rightY + LINE_HEIGHT);
    doc.text(':#653214', RIGHT_COL_X + RIGHT_VALUE_OFFSET, rightY + LINE_HEIGHT);

    doc.text('Shipment ID:', RIGHT_COL_X, rightY + (LINE_HEIGHT * 2));
    doc.text(':#985215', RIGHT_COL_X + RIGHT_VALUE_OFFSET, rightY + (LINE_HEIGHT * 2));


    // Advance the Y position past this section
    currentY += (LINE_HEIGHT * 3) + 20; 

    // Draw a separator line
    doc.strokeColor("#aaaaaa")
       .lineWidth(1)
       .moveTo(MARGIN, currentY)
       .lineTo(MARGIN + CONTENT_WIDTH, currentY)
       .stroke();

    return currentY + 20; // Extra space before table
}

// ----------------------------------------------------------------------
// --- 3. INVOICE TABLE SECTION (Items List) ---
// ----------------------------------------------------------------------
function generateInvoiceTable(doc, startY) {
    let currentY = startY;
    const HEADER_Y = currentY;
    const LINE_HEIGHT = 20;

    // Define the X-coordinates for the columns
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
    doc.font('Helvetica-Bold')
       .fontSize(10);
    
    doc.text('SL.', columns.SL, HEADER_Y);
    doc.text('Items', columns.Items, HEADER_Y);
    doc.text('Qty', columns.Qty, HEADER_Y, { width: PRICE_WIDTH, align: 'right' });
    doc.text('Units', columns.Units, HEADER_Y);
    doc.text('Unit Price', columns.UnitPrice, HEADER_Y, { width: PRICE_WIDTH, align: 'right' });
    doc.text('Price', columns.Price, HEADER_Y, { width: PRICE_WIDTH, align: 'right' });

    currentY += LINE_HEIGHT;

    // Draw the line under the header
    doc.strokeColor("#aaaaaa")
       .lineWidth(1)
       .moveTo(MARGIN, currentY)
       .lineTo(MARGIN + CONTENT_WIDTH, currentY)
       .stroke();

    currentY += 5; // Small buffer

    // --- TABLE ROWS (Example Data from UI) ---
    doc.font('Helvetica').fontSize(10);

    const items = [
        { sl: '01', item: "Apple's Shoes", qty: 5, unit: 'PC', unitPrice: '$200', price: '$1000.00' },
        { sl: '02', item: "Apple's Shoes", qty: 5, unit: 'PC', unitPrice: '$200', price: '$1000.00' },
        { sl: '03', item: "Apple's Shoes", qty: 5, unit: 'PC', unitPrice: '$200', price: '$1000.00' },
        { sl: '04', item: "Apple's Shoes", qty: 5, unit: 'PC', unitPrice: '$200', price: '$1000.00' },
    ];
    
    items.forEach((item) => {
        
        doc.text(item.sl, columns.SL, currentY);
        doc.text(item.item, columns.Items, currentY);
        doc.text(item.qty.toString(), columns.Qty, currentY, { width: PRICE_WIDTH, align: 'right' });
        doc.text(item.unit, columns.Units, currentY);
        doc.text(item.unitPrice, columns.UnitPrice, currentY, { width: PRICE_WIDTH, align: 'right' });
        doc.text(item.price, columns.Price, currentY, { width: PRICE_WIDTH, align: 'right' });

        currentY += LINE_HEIGHT;
    });

    // Final line after the items (for the table bottom)
    doc.strokeColor("#aaaaaa")
       .lineWidth(1)
       .moveTo(MARGIN, currentY)
       .lineTo(MARGIN + CONTENT_WIDTH, currentY)
       .stroke();

    return currentY + 15; 
}


// ----------------------------------------------------------------------
// --- 4. TOTALS & FOOTER SECTION ---
// ----------------------------------------------------------------------
function generateTotals(doc, startY) {
    let currentY = startY;
    
    // Position the totals block near the right side
    const LABEL_COL_X = MARGIN + 350; 
    const VALUE_COL_X = MARGIN + 460;
    const PRICE_WIDTH = 60;
    
    // --- Sales By: (Left Aligned) ---
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Sales By:', MARGIN, currentY);
    doc.font('Helvetica');
    doc.text('Jammal', MARGIN + 50, currentY);
    
    // --- Subtotal (Right Aligned) ---
    doc.font('Helvetica-Bold');
    doc.text('Subtotal:', LABEL_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });
    doc.font('Helvetica');
    doc.text('$4000.00', VALUE_COL_X, currentY, { width: PRICE_WIDTH, align: 'right' });
    
    currentY += 100; // Skip down to where the footer should be

    // --- Footer ---
    doc.fontSize(
        10,
    ).text(
        'Payment is due within 15 days. Thank you for your business.',
        50, // Start X (MARGIN)
        currentY, // Y Position
        { align: 'center', width: CONTENT_WIDTH },
    );
}

// ----------------------------------------------------------------------
// --- 5. MAIN INVOCATION FUNCTION ---
// ----------------------------------------------------------------------
export function createInvoice(invoice, path) {
    // The PDF is white by default (no need to draw a white background)
    let doc = new PDFDocument({ margin: MARGIN });

    // Pipe the document to a write stream
    doc.pipe(fs.createWriteStream(path));
    
    drawInvoiceContent(doc); // Draw all the content

    doc.end();
}


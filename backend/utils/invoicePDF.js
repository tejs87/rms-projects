const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = async function generateInvoicePDF(invoice, filePath) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40 });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // HEADER
            doc.fontSize(20).text("Sunny Bites Café", { align: "center" });
            doc.fontSize(12).text("Receipt / Tax Invoice", { align: "center" });
            doc.moveDown();

            // Basic Info
            doc.fontSize(12).text(`Invoice No: ${invoice.invoiceNumber}`);
            doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`);
            doc.text(`Table No: ${invoice.tableNumber}`);
            doc.moveDown();

            doc.text(`Payment Method: ${invoice.paymentMethod.toUpperCase()}`);
            doc.moveDown();

            // ITEMS HEADER
            doc.fontSize(14).text("Items:", { underline: true });
            doc.moveDown(0.5);

            doc.fontSize(12);
            invoice.items.forEach(item => {
                doc.text(`${item.name} (x${item.quantity}) - ₹${item.total}`);
            });

            doc.moveDown(1);

            // TOTALS
            doc.fontSize(12).text(`Subtotal: ₹${invoice.subtotal}`);
            doc.text(`Tax: ₹${invoice.tax}`);
            doc.text(`Service Charge: ₹${invoice.serviceCharge}`);
            doc.text(`Grand Total: ₹${invoice.grandTotal}`, { underline: true });
            doc.moveDown(1);

            // FOOTER
            doc.fontSize(10).text("Thank you for dining with us!", { align: "center" });

            doc.end();

            stream.on("finish", () => resolve(true));
            stream.on("error", reject);

        } catch (err) {
            reject(err);
        }
    });
};

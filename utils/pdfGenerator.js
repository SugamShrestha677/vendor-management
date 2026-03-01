import PDFDocument from 'pdfkit';

export const generatePDF = async (data, type) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Purchase Report', { align: 'center' });
      doc.moveDown();

      if (type === 'requests') {
        doc.fontSize(14).text('Purchase Requests Report', { underline: true });
        doc.moveDown();

        data.forEach((request, index) => {
          doc.fontSize(12).text(`Request ${index + 1}: ${request.requestNumber}`);
          doc.text(`Amount: $${request.totalAmount}`);
          doc.text(`Status: ${request.status}`);
          doc.text(`Department: ${request.department}`);
          doc.moveDown();
        });
      } else if (type === 'orders') {
        doc.fontSize(14).text('Purchase Orders Report', { underline: true });
        doc.moveDown();

        data.forEach((order, index) => {
          doc.fontSize(12).text(`Order ${index + 1}: ${order.orderNumber}`);
          doc.text(`Amount: $${order.totalAmount}`);
          doc.text(`Status: ${order.status}`);
          doc.moveDown();
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

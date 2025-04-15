import { jsPDF } from "jspdf";

export interface QRCodeForPrint {
    // id: string;
    dataUrl: string;
    // voterType: string;
    voterId: string;
}

export function generateQRCodesPDF(qrCodes: QRCodeForPrint[]): jsPDF {
    const doc = new jsPDF();
    const codesPerPage = 4;
    const margin = 20;
    const marginY = 40;
    const qrSize = 70;

    qrCodes.forEach((qr, index) => {
        if (index > 0 && index % codesPerPage === 0) {
            doc.addPage();
        }

        const pageIndex = index % codesPerPage;
        const y = marginY + Math.floor(pageIndex / 2) * (qrSize + 60);
        const x = margin + (pageIndex % 2) * (qrSize + 30);

        // Add a box around the QR code section
        doc.setDrawColor(200, 200, 200);
        doc.rect(x - 5, y - 25, qrSize + 10, qrSize + 65);

        // Title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Scan the QR Code Below", x + 2, y - 10);
        doc.text("To Vote", x + 25, y);

        // QR Code
        doc.addImage(qr.dataUrl, "PNG", x, y + 3, qrSize, qrSize);

        // Footer text
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Note: This is a unique QR code", x + 5, y + qrSize + 5);
        doc.setFontSize(10);
        doc.text(
            "You can only vote once using this QR code",
            x + 1,
            y + qrSize + 12
        );
        // Voter type and ID
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`QR Code Id`, x+20, y + qrSize + 20);
        doc.text(`${qr.voterId}`, x+8, y + qrSize + 28);
    });

    return doc;
}

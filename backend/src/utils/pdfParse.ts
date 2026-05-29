import { PDFParse } from "pdf-parse"

export const extractTextFromPDF = async (pdfBuffer: Buffer) => {

    try {
        const unit8Array = new Uint8Array(pdfBuffer);
        const data = new PDFParse(unit8Array);
        return (await data.getText()).text;
    } catch (error) {
        console.log("Error parsing PDF:", error);
        throw error;

    }

}


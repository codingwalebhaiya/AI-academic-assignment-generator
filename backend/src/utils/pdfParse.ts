import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
    // const parsedData = new PDFParse(pdfBuffer)
    // const result = parsedData.getText();
    // return (await result).text

    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(pdfBuffer);
    const parser = new PDFParse(uint8Array);
    const result = await parser.getText();
    return result.text;

}


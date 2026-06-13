import puppeteer from "puppeteer";
let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;


async function getBrowser(){

        if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
       args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",  // Required in WSL/Docker: avoids /dev/shm crash
      "--disable-gpu",
    ],
      });
    }

    return browser;
  }

export async function generateAssignmentPdf(html: string) {

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, {
      //waitUntil: "networkidle0"
      waitUntil:"domcontentloaded"
    });

    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });// page.pdf() already returns binary data that can be uploaded

    return pdfBuffer;

  } finally {
    await page.close();
    await browser.close();
  }
}
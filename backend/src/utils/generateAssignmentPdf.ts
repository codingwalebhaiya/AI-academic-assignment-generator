import puppeteer, { Browser } from "puppeteer";
//let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

let browserInstance: Browser | null = null;


 // Returns a healthy browser instance.
 // If the existing browser has crashed or been closed,
 // it launches a new one.
 

async function getBrowser(): Promise<Browser> {

  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",  // Required in WSL/Docker: avoids /dev/shm crash
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--disable-extensions",
      ],
    });

    browserInstance.on("disconnected", () => {
      console.warn("⚠️ Puppeteer browser disconnected");
      browserInstance = null;
    })
  }


  return browserInstance;
}

  // Generates a PDF buffer from HTML.
export async function generateAssignmentPdf(html: string):Promise<Buffer> {

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {

     await page.setViewport({
      width: 1280,
      height: 720,
    });
    await page.setContent(html, {
      //waitUntil: "networkidle0"
      waitUntil: "domcontentloaded"
    });

    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
      preferCSSPageSize:true
    });// page.pdf() already returns binary data that can be uploaded

    return Buffer.from(pdf);

  } finally {
    // Always close the page to avoid memory leaks.
    await page.close().catch(() => {});
   // await page.close();

    // if (browser) {
    //   await browser.close();
    //   browser = null;
    // }
  }
}


  // Optional cleanup function.
  // Call this when your server shuts down.
 
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    try {
      await browserInstance.close();
    } catch (err) {
      console.error("Error closing browser:", err);
    } finally {
      browserInstance = null;
    }
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await closeBrowser();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeBrowser();
  process.exit(0);
});
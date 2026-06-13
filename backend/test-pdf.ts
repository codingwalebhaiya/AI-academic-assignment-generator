import puppeteer from "puppeteer";
import fs from "fs";
// test-pdf.ts file should be in backend root folder
// generate pdf using this file run in backend terminal - npx tsx test-pdf.ts  
// pdf file will be generated in backend root folder   

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent("<h1>Hello PDF</h1>");

  const pdf = await page.pdf({
    format: "A4",
  });

  fs.writeFileSync("test.pdf", pdf);

  await browser.close();

  console.log("PDF created successfully");
}

main().catch(console.error);
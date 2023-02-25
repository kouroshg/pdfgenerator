const express = require("express");
const app = express();
const port = 3000;
const puppeteer = require("puppeteer");
const fs = require("fs");

app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/pdf", async (req, res) => {
  const buffer = await createPdf(JSON.stringify(req.body));
  res.end(buffer);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function createPdf(data) {
  // save the data to a file
  await fs.promises.writeFile("html/report.json", data);

  // run a chromium instance with CORS disabled
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-web-security"],
  });

  // create a new page
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  await page.goto(`file://${__dirname}/html/index.html`, {
    waitUntil: "networkidle0",
  });

  // we Use pdf function to generate the pdf in the same folder as this file.
  const buffer = await page.pdf({
    path: "report.pdf",
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "40px",
      bottom: "20px",
      left: "40px",
    },
  });

  await browser.close();
  return buffer;
}

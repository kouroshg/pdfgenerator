import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";
const fs = require("fs").promises;

export default async function (req, res) {
  // replace {{data}} with the data you want to pass to the html page
  const data = JSON.stringify(req.body);
  const filePath = `${__dirname}/html/index.html`;
  const html = await fs.readFile(filePath, "utf8");
  const replacedHtml = html.replace('"{data}"', data);

  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 612, height: 792, deviceScaleFactor: 3 });
  await page.setContent(replacedHtml);

  // get pdf buffer.
  const buffer = await page.pdf({
    format: "letter",
    printBackground: true,
    margin: {
      top: "20px",
      right: "30px",
      bottom: "20px",
      left: "30px",
    },
    displayHeaderFooter: true,
    footerTemplate: `<div style="font-size: 12px; color: black; text-align: right; width: 100%">
                        <span class="pageNumber" style="margin-right: 40px; margin-bottom:30px"></span>
                    </div>`,
  });

  await browser.close();
  res.end(buffer.toString("base64"));
}

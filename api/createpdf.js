import edgeChromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
const fs = require("fs").promises;

// You may want to change this if you're developing
// on a platform different from macOS.
// See https://github.com/vercel/og-image for a more resilient
// system-agnostic options for Puppeteeer.
const LOCAL_CHROME_EXECUTABLE =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export default async function (req, res) {
  // replace {{data}} with the data you want to pass to the html page
  const data = JSON.stringify(req.body);
  const filePath = `${__dirname}/html/index.html`;
  const html = await fs.readFile(filePath, "utf8");
  const replacedHtml = html.replace('"{data}"', data);

  // Edge executable will return an empty string locally.
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 612, height: 792, deviceScaleFactor: 3 });
  await page.setContent(replacedHtml);

  // we Use pdf function to generate the pdf in the same folder as this file.
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

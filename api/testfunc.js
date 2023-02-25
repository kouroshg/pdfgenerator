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
  //   await fs.writeFile(filePath, replacedHtml, "utf8");

  // Edge executable will return an empty string locally.
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });

  const page = await browser.newPage();
  await page.setContent(replacedHtml);

  // we Use pdf function to generate the pdf in the same folder as this file.
  const buffer = await page.pdf({
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
  res.send(replacedHtml);
  //   res.end(buffer);
}

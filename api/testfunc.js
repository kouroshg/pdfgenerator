import edgeChromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

// You may want to change this if you're developing
// on a platform different from macOS.
// See https://github.com/vercel/og-image for a more resilient
// system-agnostic options for Puppeteeer.
const LOCAL_CHROME_EXECUTABLE =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export default async function (req, res) {
  // Edge executable will return an empty string locally.
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/html/index.html`);

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

  res.send("hello");
}

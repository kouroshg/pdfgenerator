import edgeChromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

// You may want to change this if you're developing
// on a platform different from macOS.
// See https://github.com/vercel/og-image for a more resilient
// system-agnostic options for Puppeteeer.
const LOCAL_CHROME_EXECUTABLE =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

module.exports = async (req, res) => {
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;
  // run a chromium instance with CORS disabled
  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
    args: ["--disable-web-security", "--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://github.com");

  res.status(200).send(`Hello, world!`);
};

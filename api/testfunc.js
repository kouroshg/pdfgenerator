const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  // run a chromium instance with CORS disabled
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-web-security"],
  });

  res.status(200).send(`Hello, world!`);
};

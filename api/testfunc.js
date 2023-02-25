const PCR = require("puppeteer-chromium-resolver");
// const puppeteer = require("puppeteer");

// prepare the chromium instance
const stats = await PCR({});

module.exports = async (req, res) => {
  // run a chromium instance with CORS disabled
  const browser = await stats.puppeteer
    .launch({
      headless: false,
      args: ["--disable-web-security", "--no-sandbox"],
      executablePath: stats.executablePath,
    })
    .catch(function (error) {
      console.log(error);
    });
  res.status(200).send(`Hello, world!`);
};

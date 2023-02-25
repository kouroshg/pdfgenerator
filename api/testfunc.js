const PCR = require("puppeteer-chromium-resolver");
// const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const stats = await PCR({});
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

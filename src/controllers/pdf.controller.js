import puppeteer from 'puppeteer';

const generatePDF = async (req, res) => {
  const targetUrl = req.headers.referer || "https://uplatnica.vercel.app/"
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV === "production"
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : puppeteer.executablePath()
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    await page.goto(targetUrl);
    const element = await page.waitForSelector('.sc-ksZaOG');
    const screenshot = await element.screenshot();
    await page.setContent(`
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                html, body {
                  box-sizing: border-box;
                  display: flex;
                  justify-content: center;
                  width: 100vw;
                  padding: 1rem;
                  margin: 0;
                }
                img {
                  width: 100%;
                }
            </style>
        </head>
        <body>
          <img src="data:img/png;base64,${screenshot.toString('base64')}">
        </body>
    </html>
    `)
    const pdf = await page.pdf({
      format: 'A4'
    })
    res.contentType("application/pdf");
    res.set("Content-Disposition", "attachment; filename=uplatnica.pdf")
    res.send(pdf)
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
  finally {
    await browser.close();
  }
}

export default generatePDF
import puppeteer from 'puppeteer';

const generatePDF = async (req, res) => {
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
    await page.goto(req.headers.referer);
    const element = await page.waitForSelector('#target');
    const currentTime = new Date().getTime()
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
    console.log('before creating pdf')
    const pdf = await page.pdf({
      path: `tmp/uplatnica-${currentTime}.pdf`,
      format: 'A4'
    })
    console.log('after creating pdf')
    res.download(`tmp/uplatnica-${currentTime}.pdf`)
  }
  catch (error) {
    res.json({
      message: 'Something went wrong'
    })
  }
  finally {
    await browser.close();
  }
}

export default generatePDF
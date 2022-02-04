import express from 'express'
import playwright from 'playwright'

const headless = true
const router = express.Router()

router.post('/screenshot', async function (req, res) {
  // TODO: use express-validator
  console.log('getting screenshot...', req.body.link)
  const screenshot = await getScreenshot(req.body.link)
  res.status(200).json(screenshot)
})

async function getScreenshot(link) {
  const browser = await playwright.firefox.launch({ headless })
  const page = await browser.newPage({
    extraHTTPHeaders: { 'Referer': 'https://www.google.com/' },
    userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
    viewport: {
      width: 1280,
      height: 720
    }
  })

  await page.goto(link, { waitUntil: 'load' })

  const buffer = await page.screenshot({
    type: 'png',
    fullPage: true,
    clip: {
      x: 0,
      y: 0,
      width: 1280,
      height: 1280
    }
  })

  console.log('Buffer.byteLength:', Buffer.byteLength(buffer))

  if (!headless) await page.pause()

  await browser.close()

  return `data:image/png;base64,${buffer.toString('base64')}`
}

export default router

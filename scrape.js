import playwright from 'playwright'

async function scrape (userData) {
  const browser = await playwright.firefox.launch({
    headless: false // to be able to watch what's going on.
  })

  const page = await browser.newPage()

  await page.goto('https://google.com/')
  await page.waitForTimeout(1000)
  await page.fill('form[action="/search"] input[type="text"]', userData)
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter')

  await page.waitForTimeout(30000)
  await browser.close()
}

export { scrape }

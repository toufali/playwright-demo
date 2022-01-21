import playwright from 'playwright'

async function scrape (userData) {
  const browser = await playwright.firefox.launch({ headless: false })

  const page = await browser.newPage()

  await page.goto('https://google.com/')
  await page.fill('form[action="/search"] input[type="text"]', userData)
  await page.keyboard.press('Enter')
  await page.waitForEvent('close', { timeout: 60000 }).catch(e => console.log('closing browser after 60 sec timeout'))
  await browser.close()
}

export { scrape }

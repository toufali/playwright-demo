import playwright from 'playwright'

const headless = true

async function scrape(query, searchUrl = 'https://google.com/search') {
  const browser = await playwright.firefox.launch({ headless })
  const page = await browser.newPage()
  const url = new URL(searchUrl)

  url.searchParams.set('q', query)
  url.searchParams.set('num', 50)
  await page.goto(url.href, { waitUntil: 'domcontentloaded' })

  const locator = page.locator('#search a')
  const results = await locator.evaluateAll(anchors => anchors.reduce((acc, cur) => {
    // For Google, get results that include a "cite" element to omit non-search-related hrefs
    if (cur.nextElementSibling?.querySelector('cite')) acc.push(cur.href)
    return acc
  }, []))

  if (!headless) await page.pause()

  await browser.close()
  return results
}

export { scrape }

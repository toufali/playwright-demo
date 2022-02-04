import express from 'express'
import playwright from 'playwright'
import db from '../db.js'

const router = express.Router()

router.post('/search', async function (req, res) {
  // TODO: use express-validator
  console.log(`searching ${req.body.userdata} using ${req.body.provider}...`)
  const headless = req.body.headless === 'true'
  const links = await scrape(req.body.userdata, req.body.provider, headless)
  // console.log(links)
  const res1 = await db.query('SELECT id, domain, link FROM data_brokers RIGHT JOIN UNNEST ($1::text[]) AS link ON link ~ domain', [links])

  console.log(res1.rows)
  res.status(200).json(res1.rows)
})

async function scrape(query, provider = 'google', headless = true) {
  const browser = await playwright.firefox.launch({ headless })
  const page = await browser.newPage()

  let url, locator, results

  switch (provider) {
    case 'google':
      url = new URL('https://google.com/search')
      url.searchParams.set('q', query)
      url.searchParams.set('num', 50)
      await page.goto(url.href, { waitUntil: 'domcontentloaded' })
      locator = page.locator('#search a')
      results = await locator.evaluateAll(anchors => anchors.reduce((acc, cur) => {
        // get results that include a "cite" element to omit non-search-related hrefs
        if (cur.nextElementSibling?.querySelector('cite')) acc.push(cur.href)
        return acc
      }, []))
      break
    case 'bing':
      url = new URL('https://www.bing.com/search')
      url.searchParams.set('q', `+"${query}"`) // add "+" and quotes to avoid similar/fuzzy results
      url.searchParams.set('count', 50)
      await page.goto(url.href, { waitUntil: 'domcontentloaded' })
      locator = page.locator('#b_results li')
      results = await locator.evaluateAll(items => items.map(item => item.querySelector('a')?.href).filter(href => href))
      break
    case 'yahoo':
      url = new URL('https://search.yahoo.com/search')
      url.searchParams.set('p', query)
      url.searchParams.set('n', 40) // doesn't appear to work for results-per-page
      await page.goto(url.href, { waitUntil: 'domcontentloaded' })
      locator = page.locator('#web li')
      results = await locator.evaluateAll(items => items.map(item => item.querySelector('.title a')?.href).filter(href => href))
      break
  }

  if (!headless) await page.waitForEvent('close', { timeout: 300000 })

  await browser.close()
  return results
}

export default router

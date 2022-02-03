import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'process'
import { scrape } from './scrape.js'
import db from './db.js'

async function main() {
  const rl = readline.createInterface({ input, output })
  const userData = await rl.question('Enter search data: ')

  rl.close()
  searchUserData(userData)
}

async function searchUserData(userData) {
  console.log(`searching ${userData}...`)
  const links = await scrape(userData)
  console.log(links)
  const res1 = await db.query('SELECT id, domain, link FROM data_brokers JOIN UNNEST ($1::text[]) AS link ON link ~ domain', [links])

  console.log(res1.rows)
}

main()

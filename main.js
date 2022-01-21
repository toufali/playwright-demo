import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'process'
import { scrape } from './scrape.js'

async function main () {
  const rl = readline.createInterface({ input, output })
  const userData = await rl.question('Enter search data: ')

  rl.close()
  console.log(`searching ${userData}...`)
  scrape(userData)
}

main()

import * as readline from 'readline/promises'
import { stdin as input, stdout as output } from 'process'
import { scrape } from './scrape.js'

async function main () {
  const rl = readline.createInterface({ input, output })
  const userData = await rl.question('Enter search data: ')

  scrape(userData)
}

main()

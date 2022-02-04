import 'dotenv/config.js'
import express from 'express'
import search from './routes/search.js'
import broker from './routes/broker.js'
import screenshot from './routes/screenshot.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(search)
app.use(broker)
app.use(screenshot)
app.use(express.static('client'))

app.listen(port, () => console.log(`Express app listening on port ${port}`))

import express from 'express'
import db from '../db.js'

const router = express.Router()

router.post('/broker/:id', async function (req, res) {
  // TODO: use express-validator
  console.log('getting broker details...', req.params.id)
  const query = await db.query('SELECT name, domain, optout_url FROM data_brokers WHERE id=$1', [req.params.id])

  res.status(200).json(query.rows[0])
})

export default router

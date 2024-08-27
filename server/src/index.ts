import express from 'express'
import 'dotenv/config'
import './config/env'

import expressConfigurator from './config/express-configurator'
import dbConnection from './config/db-connection'
import routesConfigurator from './config/routes-configurator'

const PORT = process.env.PORT || 5000
const app = express()

async function start() {
  expressConfigurator(app)
  await dbConnection()
  routesConfigurator(app)

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
  })
}
start()

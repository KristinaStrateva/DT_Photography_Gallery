import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import logger from '../middlewares/logger'
import corsOptions from './cors-options'

function expressConfigurator(app: Application): void {
  console.log(`Node.js execution mode: ${process.env.NODE_ENV}`)

  app.use(logger)
  app.use(cors(corsOptions))
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cookieParser())
}

export default expressConfigurator

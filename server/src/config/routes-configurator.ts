import { Application } from 'express'
import authenticationRoutes from '../routes/auth-routes'
import errorHandler from '../middlewares/error-handler'

const START_ENDPOINT = '/api'

export default function routesConfigurator(app: Application) {
  app.use(`${START_ENDPOINT}/auth`, authenticationRoutes)

  app.use(errorHandler)
}

import express from 'express'
import withAsyncHandler from '../utils/with-async-handler'

import loginRequestValidation from '../middlewares/validations/login-req-validation'
import registerReqEmployeeVal from '../middlewares/validations/register-employee-req'
import registerReqCompanyVal from '../middlewares/validations/register-company-req'

import userAuthController from '../controllers/user-auth.controller'

const router = express.Router()

router.post(
  '/login',
  loginRequestValidation,
  withAsyncHandler(userAuthController.loginHandler),
)

router.post(
  '/register/employee',
  registerReqEmployeeVal,
  withAsyncHandler(userAuthController.registerEmployeeHandler),
)

router.post(
  '/register/company',
  registerReqCompanyVal,
  withAsyncHandler(userAuthController.registerCompanyHandler),
)

export default router

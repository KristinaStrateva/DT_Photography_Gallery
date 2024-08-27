import { Response } from 'express'
import { TypedRequestBody } from 'zod-express'

import config from '../utils/config'

import { LoginSchemaType } from '../middlewares/validations/login-req-validation'
import { RegisterEmployeeSchemaType } from '../middlewares/validations/register-employee-req'
import { RegisterCompanySchemaType } from '../middlewares/validations/register-company-req'

import loginUserService from '../services/login-user.service'
import registerEmployeeService from '../services/register-employee.service'
import registerCompanyService from '../services/register-company.service'

const accessTokenCookieOptions = config.get('accessTokenCookieOptions')
const refreshTokenCookieOptions = config.get('refreshTokenCookieOptions')

async function loginHandler(
  req: TypedRequestBody<LoginSchemaType>,
  res: Response,
) {
  try {
    const { accessToken, refreshToken, payload } = await loginUserService({
      ...req.body,
    })

    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

    res.status(200).json({
      token: accessToken,
      payload,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}

async function registerEmployeeHandler(
  req: TypedRequestBody<RegisterEmployeeSchemaType>,
  res: Response,
) {
  try {
    const { accessToken, refreshToken, payload } =
      await registerEmployeeService({
        ...req.body,
      })

    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

    res.status(201).json({
      token: accessToken,
      payload,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}

async function registerCompanyHandler(
  req: TypedRequestBody<RegisterCompanySchemaType>,
  res: Response,
) {
  try {
    const { accessToken, refreshToken, payload } = await registerCompanyService(
      {
        ...req.body,
      },
    )

    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

    res.status(201).json({
      token: accessToken,
      payload,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}

export default { loginHandler, registerEmployeeHandler, registerCompanyHandler }

import { NextFunction, Response } from 'express'
import { verifyJWT } from '../utils/jwt-utils'
import { AuthenticatedRequest } from '../types/authRequest'

async function authVerification(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const { accessToken } = req.cookies

  if (!accessToken) {
    return res.status(401).json({ message: 'Not authenticated!' })
  }

  const verifiedToken = verifyJWT(accessToken)

  if (!verifiedToken.payload) {
    return res.status(401).json({ message: 'Expired access token!' })
  }

  req.user = verifiedToken.payload

  return next()
}

export default authVerification

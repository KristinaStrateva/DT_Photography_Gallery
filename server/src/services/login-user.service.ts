import { compare } from 'bcrypt'

import { signJWT, signJWT_Refresh } from '../utils/jwt-utils'
import { prisma } from '../config/db-connection'
import { LoginBodyType } from '../middlewares/validations/login-req-validation'

export default async function loginUserService({
  email,
  password,
}: LoginBodyType) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.password) {
    throw new Error('Not Authorized. Invalid email or password!')
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    throw new Error('Not Authorized. Invalid email or password!')
  }

  const payload = {
    id: user.id,
    email: user.email,
    type: user.type,
  }

  const accessToken = await signJWT(payload)
  const refreshToken = await signJWT_Refresh(payload)

  return {
    accessToken,
    refreshToken,
    payload,
  }
}

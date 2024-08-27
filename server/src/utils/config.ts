import { CookieOptions } from 'express'

const options = {
  origin: process.env.ORIGIN,
  jwt_public_key: process.env.ACCESS_TOKEN_SECRET,
  jwt_refresh_key: process.env.REFRESH_TOKEN_SECRET,
  acessTokenExp: '15min',
  refreshTokenExp: '7day',
  accessTokenCookieOptions: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: true,
  } as CookieOptions,
  refreshTokenCookieOptions: {
    maxAge: 900000,
    httpOnly: true,
    domain: 'localhost',
    path: '/api/auth/refresh-token',
    sameSite: 'strict',
    secure: true,
  } as CookieOptions,
} as const

type Options = keyof typeof options
type OptionType<T extends Options> = (typeof options)[T]

const config = {
  get: <T extends Options>(option: T): OptionType<T> => options[option],
}

export default config

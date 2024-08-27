import jwt, { Secret, TokenExpiredError } from 'jsonwebtoken'
import config from './config'
import { UserType } from '../types/userTypes'

export interface Payload {
  id: string
  email: string
  type: UserType
}

export interface VerifiedJWT {
  payload: Payload | null
  expired?: boolean
}

const publicKey = config.get('jwt_public_key')
const refreshKey = config.get('jwt_refresh_key')

export function signJWT(payload: Payload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      publicKey,
      {
        expiresIn: config.get('acessTokenExp'),
        algorithm: 'HS256',
        issuer: payload.id,
      },
      (err, encoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(encoded as string)
        }
      },
    )
  })
}

export function signJWT_Refresh(payload: Payload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      refreshKey,
      {
        expiresIn: config.get('refreshTokenExp'),
        algorithm: 'HS256',
        issuer: payload.id,
      },
      (err, encoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(encoded as string)
        }
      },
    )
  })
}

function withVerifyJWT(verifyKey: Secret) {
  return (token: string): VerifiedJWT => {
    try {
      const decoded = jwt.verify(token, verifyKey) as Payload

      return { payload: decoded, expired: false }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return { payload: null, expired: true }
      }

      return { payload: null }
    }
  }
}

export const verifyJWT = withVerifyJWT(publicKey)
export const verifyJWT_Refresh = withVerifyJWT(refreshKey)

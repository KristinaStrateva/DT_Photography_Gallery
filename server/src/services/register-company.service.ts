import { hash } from 'bcrypt'
import { prisma } from '../config/db-connection'
import { RegisterCompanyBodyType } from '../middlewares/validations/register-company-req'

import { signJWT, signJWT_Refresh } from '../utils/jwt-utils'

export default async function registerCompanyService(
  body: RegisterCompanyBodyType,
) {
  const emailExists = await prisma.user.findUnique({
    where: { email: body.email },
  })

  // Todo - Create custom error classes
  if (emailExists) {
    throw new Error('Company with this email already exists!')
  }

  const companyExists = await prisma.company.findFirst({
    where: {
      OR: [{ name: body.companyName }, { vat: body.VATNumber }],
    },
  })

  if (companyExists) {
    if (companyExists.name === body.companyName) {
      throw new Error('Company with the same name already exists!')
    }
    if (companyExists.vat === body.VATNumber) {
      throw new Error('Company with the same VAT number already exists!')
    }
  }

  const hashedPassword = await hash(body.password, 10)

  const payload = await prisma.$transaction(async (tx) => {
    try {
      const user = await tx.user.create({
        data: { email: body.email, type: 'company', password: hashedPassword },
      })

      // - Todo ask about this information
      await tx.company.create({
        data: {
          companyId: user.id,
          name: body.companyName,
          phoneNumber: body.phoneNumber,
          vat: body.VATNumber,
        },
      })

      return {
        id: user.id,
        email: body.email,
        type: user.type,
      }
    } catch (error) {
      console.error('Transaction failed: ', error)
      throw new Error(
        'Transaction failed: Unable to register the company and user',
      )
    }
  })

  const accessToken = await signJWT(payload)
  const refreshToken = await signJWT_Refresh(payload)

  return {
    accessToken,
    refreshToken,
    payload,
  }
}

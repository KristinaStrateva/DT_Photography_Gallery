import { hash } from 'bcrypt'
import { prisma } from '../config/db-connection'
import { RegisterEmployeeBodyType } from '../middlewares/validations/register-employee-req'

import { signJWT, signJWT_Refresh } from '../utils/jwt-utils'

export default async function registerEmployeeService(
  body: RegisterEmployeeBodyType,
) {
  const emailExists = await prisma.user.findUnique({
    where: { email: body.email },
  })

  // Todo - Create custom error classes
  if (emailExists) {
    throw new Error('Employee with this email already exists!')
  }

  const hashedPassword = await hash(body.password, 10)

  const payload = await prisma.$transaction(async (tx) => {
    try {
      const user = await tx.user.create({
        data: { email: body.email, type: 'employee', password: hashedPassword },
      })

      // - Todo ask about this information
      await tx.employee.create({
        data: {
          employeeId: user.id,
          firstName: body.firstName,
          lastName: body.lastName,
          phoneNumber: body.phoneNumber,
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

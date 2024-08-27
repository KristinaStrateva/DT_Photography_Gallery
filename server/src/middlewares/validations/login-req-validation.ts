import { z } from 'zod'
import { validateRequestBody } from 'zod-express'

const bodySchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required!')
    .email('Email type is test@email.com')
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters!')
    .max(25, 'Password must be less than 25 characters!')
    .trim(),
})

const loginValidation = validateRequestBody(bodySchema, {
  sendErrors(errors, res): void | undefined {
    const errorsArr = errors[0].errors.issues.map((err) => {
      return {
        path: err.path[0],
        message: err.message,
      }
    })
    res.status(400).json(errorsArr)
  },
})

export type LoginSchemaType = typeof bodySchema
export type LoginBodyType = z.infer<typeof bodySchema>
export default loginValidation

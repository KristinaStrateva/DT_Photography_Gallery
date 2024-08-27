import { z } from 'zod'
import { validateRequestBody } from 'zod-express'

const phoneValidation = new RegExp(/^\+359\s\d{2}\s\d{3}\s\d{4}$/)

const registerEmployeeBodySchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'Employee first name is required!' })
    .min(4, { message: 'Must be 4 or more characters long!' })
    .max(15, { message: 'Must be 15 or fewer characters long!' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Employee last name is required!' })
    .min(4, { message: 'Must be 4 or more characters long!' })
    .max(15, { message: 'Must be 15 or fewer characters long!' }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: 'Phone number is required!' })
    .regex(phoneValidation, { message: 'Invalid phone number!' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Invalid email address!' }),
  password: z
    .string()
    .trim()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Must be at least 6 characters long!' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter!',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter!',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number!',
    }),
})

const registerEmployeeValidation = validateRequestBody(
  registerEmployeeBodySchema,
  {
    sendErrors(errors, res): void | undefined {
      const errorsArr = errors[0].errors.issues.map((err) => {
        return {
          path: err.path[0],
          message: err.message,
        }
      })

      res.status(400).json(errorsArr)
    },
  },
)
export type RegisterEmployeeBodyType = z.infer<
  typeof registerEmployeeBodySchema
>
export type RegisterEmployeeSchemaType = typeof registerEmployeeBodySchema

export default registerEmployeeValidation

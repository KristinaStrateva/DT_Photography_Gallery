import { z } from 'zod'
import { validateRequestBody } from 'zod-express'

const phoneValidation = new RegExp(/^\+359\s\d{2}\s\d{3}\s\d{4}$/)

const registerCompanyBodySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, { message: 'Company name is required!' })
    .min(4, { message: 'Must be 4 or more characters long!' })
    .max(50, { message: 'Must be 50 or fewer characters long!' }),
  VATNumber: z
    .string()
    .trim()
    .min(1, { message: 'VAT Number is required!' })
    .regex(/^(EU|EL|XI|[A-Z]{2})[A-Za-z0-9]{2,13}$/, {
      message: 'Invalid VAT number format!',
    }),
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

const registerCompanyValidation = validateRequestBody(
  registerCompanyBodySchema,
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
export type RegisterCompanyBodyType = z.infer<typeof registerCompanyBodySchema>
export type RegisterCompanySchemaType = typeof registerCompanyBodySchema

export default registerCompanyValidation

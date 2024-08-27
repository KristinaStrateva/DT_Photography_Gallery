/* eslint-disable @typescript-eslint/no-namespace */

import z from 'zod'

const envSchema = z.object({
  ORIGIN: z.string().url(),
  PORT: z.coerce.number().min(1000),
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.string().url(),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
})

checkEnv()
function checkEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      console.error(
        `Validation error at ${issue.path.join('.')} - ${issue.message}`,
      )
    })
    throw new Error('Environment validation failed. See the logs for details.')
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

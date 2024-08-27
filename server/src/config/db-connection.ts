import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function dbConnection() {
  try {
    await prisma.$connect()
    console.log('DB connected successfully!')
  } catch (error) {
    console.error('Error connecting to the database', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

export default dbConnection

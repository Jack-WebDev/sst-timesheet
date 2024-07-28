import { PrismaClient } from '@prisma/client'
import { Config } from 'sst/node/config'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: Config.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db
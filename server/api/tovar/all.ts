import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query']
})

export default defineEventHandler(async () => {
  const items = await prisma.tovar.findMany({})
  return items
})

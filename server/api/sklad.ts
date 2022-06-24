import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';
const prisma = new PrismaClient({
  log: ['query']
})

export default defineEventHandler(async () => {
  const items = await prisma.yacheiki.findMany({
    include: {
      Tovar: true,
      Pokupatel: true,
    }
  })

  let sorted = {}

  items.forEach((item) => {
    if (!Object.hasOwn(sorted, item.id_Sklada)) Object.defineProperty(sorted, item.id_Sklada, { value: [], enumerable: true })
    sorted[item.id_Sklada].push(item)
  })

  return sorted
})

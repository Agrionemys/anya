import { PrismaClient } from '@prisma/client';
import { defineEventHandler, useQuery } from 'h3';
const prisma = new PrismaClient({
  log: ['query']
})

export default defineEventHandler(async (event) => {
  const query = useQuery(event)
  let items: any = []

  if (!query.search) return items;

  if (!Number.isNaN(Number(query.search))) {
    items = await prisma.zakaz.findMany({
      where: {
        Barcode: {
          in: [Number(query.search)]
        }
      },
      include: {
        Pokypatel: true
      },
    })

    return items
  }

  items = await prisma.pokupateli.findMany({
    where: {
      Familia: {
        startsWith: <string>query.search
      }
    }
  })

  return items
})

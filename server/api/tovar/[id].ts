import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query']
})

export default defineEventHandler(async (event) => {
  const item = await prisma.tovar.findFirst({
    where: {
      Barcode: Number(event.context.params.id)
    },
    include: {
      Postavchik: true,
      Rabotnik: true,
      Zakaz: true,
    }
  });
  return item;
})

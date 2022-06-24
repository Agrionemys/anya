import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query']
})

export default defineEventHandler(async (event) => {
  const items = await prisma.zakaz.findFirst({
    where: {
      id_Zakaza: Number(event.context.params.id)
    },
    include: {
      Tovar: true,
      Pokypatel: true,
      Rabotnik: true,
      Dostavka: true,
      Status_Dostavki: true
    }
  });
  return items;
})

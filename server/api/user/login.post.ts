import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query']
})

export default defineEventHandler(async (event) => {
  const body = await useBody(event)

  const user = await prisma.rabotniki.findFirst({
    where: {
      Login: body.Login,
      Parol: body.Parol
    }
  })

  return user
})

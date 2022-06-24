import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query']
})

export default defineEventHandler(async (event) => {
  const body = await useBody(event)

  if (!body.Barcode || Number.isNaN(Number(body.Barcode))) throw Error("No Barcode specified!")

  const tovar = await prisma.tovar.findFirst({
    where: {
      Barcode: Number(body.Barcode)
    },
    include: {
      Postavchik: true,
      Rabotnik: true,
      Zakaz: true,
    }
  });

  if (!tovar) throw Error("Tovar not found!")
  console.log(tovar)

  let wasCreated = false
  let yacheika = await prisma.yacheiki.findFirst({
    where: {
      Barcode: Number(body.Barcode)
    },
    include: {
      Pokupatel: true
    }
  })

  if (!yacheika) {
    wasCreated = true
    yacheika = await prisma.yacheiki.create({
      data: {
        id_Sklada: 1,
        id_Pokupatel: tovar.Zakaz[0].id_Pokypatel,
        Barcode: Number(body.Barcode)
      },
      include: {
        Pokupatel: true
      }
    })
  }

  return {
    wasCreated,
    tovar,
    yacheika,
  };
})

import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query"]
});
const _id_ = defineEventHandler(async (event) => {
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
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map

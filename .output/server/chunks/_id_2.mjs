import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query"]
});
const _id_ = defineEventHandler(async (event) => {
  const item = await prisma.tovar.findFirst({
    where: {
      Barcode: Number(event.context.params.id)
    },
    include: {
      Postavchik: true,
      Rabotnik: true,
      Zakaz: true
    }
  });
  return item;
});

export { _id_ as default };
//# sourceMappingURL=_id_2.mjs.map

import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query"]
});
const sklad = defineEventHandler(async () => {
  const items = await prisma.tovar.findMany({});
  return items;
});

export { sklad as default };
//# sourceMappingURL=sklad.mjs.map

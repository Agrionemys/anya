import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query"]
});
const all = defineEventHandler(async () => {
  const items = await prisma.zakaz.findMany({});
  return items;
});

export { all as default };
//# sourceMappingURL=all.mjs.map

import { defineEventHandler, useQuery } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query"]
});
const lookup = defineEventHandler(async (event) => {
  const query = useQuery(event);
  let items = [];
  if (!query.search)
    return items;
  if (!Number.isNaN(Number(query.search))) {
    items = await prisma.zakaz.findMany({
      where: {
        Barcode: {
          in: [Number(query.search)]
        }
      },
      include: {
        Pokypatel: true
      }
    });
    return items;
  }
  items = await prisma.pokupateli.findMany({
    where: {
      Familia: {
        startsWith: query.search
      }
    }
  });
  return items;
});

export { lookup as default };
//# sourceMappingURL=lookup.mjs.map

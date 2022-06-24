import { defineEventHandler, useBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query"]
});
const login_post = defineEventHandler(async (event) => {
  const body = await useBody(event);
  const user = await prisma.rabotniki.findFirst({
    where: {
      Login: body.Login,
      Parol: body.Parol
    }
  });
  return user;
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map

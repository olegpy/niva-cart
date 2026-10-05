import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users';
import { seedProducts } from './seeds/products';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedProducts(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

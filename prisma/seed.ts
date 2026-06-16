import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

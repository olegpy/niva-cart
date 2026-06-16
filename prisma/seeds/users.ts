import type { PrismaClient } from '@prisma/client';
import { UserRole } from '../../src/types/user';

const users = [
  {
    email: 'customer@niva-cart.local',
    name: 'Customer',
    role: UserRole.customer,
  },
  {
    email: 'admin@niva-cart.local',
    name: 'Admin',
    role: UserRole.admin,
  },
];

export async function seedUsers(prisma: PrismaClient) {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
      },
      create: user,
    });
  }

  console.log('Seeded users:', users.map((u) => `${u.role} (${u.email})`).join(', '));
}

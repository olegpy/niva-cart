import type { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { UserRole } from '../../src/features/admin/users/types';

const ADMIN_DEV_PASSWORD = 'admin123'
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
  // Hash the admin password for the dev environment
  const adminPasswordHash = await hash(ADMIN_DEV_PASSWORD, 10);

  for (const user of users) {
    const passwordHash =
      user.role === UserRole.admin ? adminPasswordHash : null;

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
      },
      create: {
        ...user,
        passwordHash,
      },
    });
  }

  console.log('Seeded users:', users.map((u) => `${u.role} (${u.email})`).join(', '));
  console.log('Admin dev login: admin@niva-cart.local / admin123');
}

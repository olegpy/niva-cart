import type { User } from '@/features/admin/users/types';
import { prisma } from '@/shared/lib/prisma';

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

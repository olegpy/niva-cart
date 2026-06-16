import type { User } from '@/types/user';
import { prisma } from '@/lib/prisma';

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

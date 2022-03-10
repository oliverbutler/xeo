import { User } from '@prisma/client';
import { prisma } from 'utils/db';

export const getUser = async (userId: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return user;
};

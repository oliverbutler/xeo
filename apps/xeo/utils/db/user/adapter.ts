import { User, UserMetadata } from '@prisma/client';
import { prisma } from 'utils/db';

export type UserWithMetadata = User & {
  metadata: UserMetadata | null;
};

export const getUserWithMetadata = async (
  userId: string
): Promise<UserWithMetadata | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { metadata: true },
  });

  return user;
};

export type CreateUserMetadata = Pick<UserMetadata, 'role' | 'preferredName'>;

export const createUserMetadata = async (
  userId: string,
  metadata: CreateUserMetadata
): Promise<UserMetadata | null> => {
  console.log(userId, metadata);

  const created = await prisma.userMetadata.create({
    data: {
      userId: userId,
      role: metadata.role,
      preferredName: metadata.preferredName,
    },
  });

  return created;
};

export const updateUserMetadata = async (
  userId: string,
  metadata: Partial<UserMetadata>
): Promise<UserMetadata | null> => {
  const updated = await prisma.userMetadata.update({
    where: { userId: userId },
    data: metadata,
  });

  return updated;
};

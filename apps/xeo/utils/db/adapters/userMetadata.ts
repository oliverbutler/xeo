import { dynoMap, tableIdToPK } from '../db';
import {
  CreateUserMetadata,
  UserMetadata,
  UserMetadataEntity,
} from '../models/userMetadata';

const USER = 'USER';

export const getUserMetadata = async (
  id: string
): Promise<UserMetadata | undefined> => {
  const user = await dynoMap<UserMetadata>(
    UserMetadataEntity.get({
      id: tableIdToPK(id, USER),
      sk: 'info',
    })
  );
  return user;
};

export const createUserMetadata = async (
  userId: string,
  input: CreateUserMetadata
): Promise<UserMetadata | undefined> => {
  await UserMetadataEntity.put({
    pk: tableIdToPK(userId, USER),
    sk: `info`,
    ...input,
  });
  return getUserMetadata(userId);
};

export const deleteUserMetadata = async (
  userId: string
): Promise<UserMetadata | undefined> => {
  await UserMetadataEntity.delete({
    pk: tableIdToPK(userId, USER),
    sk: `info`,
  });
  return getUserMetadata(userId);
};

export const updateUserMetadata = async (
  userId: string,
  input: Partial<UserMetadata>
): Promise<UserMetadata | undefined> => {
  await UserMetadataEntity.update({
    pk: tableIdToPK(userId, USER),
    sk: `info`,
    ...input,
  });
  return getUserMetadata(userId);
};

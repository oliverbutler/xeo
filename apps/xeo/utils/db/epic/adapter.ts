import { NotionDatabase, NotionEpic } from '@prisma/client';
import { prisma } from '..';

export type UpdateNotionEpic = Partial<
  Omit<CreateNotionEpic, 'notionDatabaseId'>
> & {
  active?: boolean;
};

export interface CreateNotionEpic {
  notionEpicName: string;
  notionEpicId: string;
  notionEpicIcon: string | null;
  notionDatabaseId: NotionDatabase['id'];
}

export const createNotionEpic = async (input: CreateNotionEpic) => {
  const result = await prisma.notionEpic.create({
    data: {
      notionEpicName: input.notionEpicName,
      notionEpicId: input.notionEpicId,
      notionEpicIcon: input.notionEpicIcon,
      notionDatabaseId: input.notionDatabaseId,
    },
  });

  return result;
};

export const updateNotionEpic = async (
  id: NotionEpic['id'],
  input: UpdateNotionEpic
) => {
  const result = await prisma.notionEpic.update({
    where: { id },
    data: input,
  });

  return result;
};

export const deleteNotionEpic = async (id: NotionEpic['id']) => {
  const result = await prisma.notionEpic.delete({
    where: { id },
  });

  return result;
};

export const getNotionEpic = async (id: NotionEpic['id']) => {
  const result = await prisma.notionEpic.findUnique({
    where: { id },
  });

  return result;
};

export const getNotionEpicsForDatabase = async (
  databaseId: NotionDatabase['id']
) => {
  const result = await prisma.notionEpic.findMany({
    where: {
      notionDatabaseId: databaseId,
    },
  });

  return result;
};

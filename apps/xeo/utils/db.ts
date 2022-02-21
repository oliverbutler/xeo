/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';

export const prisma = (global as any).prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') (global as any).prisma = prisma;

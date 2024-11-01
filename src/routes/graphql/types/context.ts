import Loader from '../loader.js';
import { PrismaClient } from '@prisma/client';

export type Context = {
    db: PrismaClient;
    loader: Loader;
};

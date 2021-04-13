import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';

const expiry = 60 * 60 * 24;

export const createConfirmEmailLink = async (url: string, userId: string, redis: Redis) => {
    const id = uuidv4();

    await redis.set(id, userId, "ex", expiry);
    return `${url}/confirm/${id}`;
}
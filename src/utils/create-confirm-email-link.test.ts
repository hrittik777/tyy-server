import * as Redis from 'ioredis';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { User } from '../entity/User';
import { createConfirmEmailLink } from './create-confirm-email-link';
import { createTypeORMConnection } from './create-typeORM-connection';

let userId = '';
let conn: Connection;
const testEmail = 'test@gmail.com';
const testPassword = 'Admin@123';
const redis = new Redis();

beforeAll(async () => {
    conn = await createTypeORMConnection();
    const user = await User.create({ email: testEmail, password: testPassword }).save();
    userId = user.id;
});

afterAll(async () => {
    conn.close();
});

test('tests for user confirmation and deleting redis key after', async () => {

    const url = await createConfirmEmailLink(process.env.TEST_HOST as string, userId as string, redis);
    const response = await fetch(`${url}`);
    const text = await response.text();
    expect(text).toEqual('ok');

    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();

    const prms = url.split('/');
    const key = prms[prms.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
});



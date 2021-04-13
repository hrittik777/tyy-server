import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { startServer } from '../../startServer';
import { createTypeORMConnection } from '../../utils/create-typeORM-connection';
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from './error-messages';

const testEmail = 'test@gmail.com';
const testEmail2 = 'test2@gmail.com';
const testPassword = 'Test@123';
const badEmail = 'ab';
const badPassword = 'xy';

const mutation = (e: string, p: String) =>
    `mutation {
        register(email: "${e}", password: "${p}") {
            path
            message
        }
    }`;

beforeAll(async () => {
    await createTypeORMConnection();
});

describe('Register User', () => {
    it('test for register user', async () => {
        const response = await request(process.env.TEST_HOST as string, mutation(testEmail, testPassword));
        expect(response).toEqual({ register: null });

        const users = await User.find({ where: { email: testEmail } });
        expect(users).toHaveLength(1);

        const user = users[0];
        expect(user.email).toEqual(testEmail);
        expect(user.password).not.toEqual(testPassword);
    });

    it('test for duplicate emails', async () => {
        const response2: any = await request(process.env.TEST_HOST as string, mutation(testEmail, testPassword));
        expect(response2.register).toHaveLength(1);
        expect(response2.register[0]).toEqual({ path: 'email', message: duplicateEmail });
    });

    it('test for bad email', async () => {
        const response3: any = await request(process.env.TEST_HOST as string, mutation(badEmail, testPassword));
        expect(response3).toEqual({
            register: [
                { path: 'email', message: emailNotLongEnough },
                { path: 'email', message: invalidEmail }
            ]
        });
    });

    it('test for bad password', async () => {
        const response4: any = await request(process.env.TEST_HOST as string, mutation(testEmail2, badPassword));
        expect(response4).toEqual({
            register: [
                { path: 'password', message: passwordNotLongEnough }
            ]
        });
    });

    it('test for bad password and bad email', async () => {
        const response5: any = await request(process.env.TEST_HOST as string, mutation(badEmail, badPassword));
        expect(response5).toEqual({
            register: [
                {
                    path: "email",
                    message: emailNotLongEnough
                },
                {
                    path: "email",
                    message: invalidEmail
                },
                {
                    path: "password",
                    message: passwordNotLongEnough
                }
            ]
        });
    });
});
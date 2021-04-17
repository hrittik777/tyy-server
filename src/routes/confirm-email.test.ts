import fetch from 'node-fetch';

let badUserId = '+';

test('tests for sending invalid if bad ID is sent', async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/${badUserId}`);
    const text = await response.text();
    expect(text).toEqual('invalid');
});
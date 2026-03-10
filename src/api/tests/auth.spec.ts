import { test, expect } from '@playwright/test';

import { AuthClient } from '../clients/authClient';
import {
  errorSchema,
  registerSchema,
  loginSchema
} from '../schemas/authSchemas';

import { apiFactory } from '../../utils/apiFactory';

test.describe('@A2 @API - Authentication & Negative Testing', () => {
  let authClient: AuthClient;
  test.beforeEach(async ({ request }) => {
    authClient = new AuthClient(request);
  });

  test('POST: Successful registration with a valid payload; verify the token', async () => {
    const { email, password } = apiFactory.getRandomEmailAndPassword();
    const { response, info } =
      await test.step('Send request to create user', async () => {
        const res = await authClient.register(email, password);
        return { response: res, info: await res.json() };
      });
    expect(response.status()).toBe(200);
    expect(info).toMatchObject(registerSchema);
    expect(info.token.length).toBeGreaterThan(0);
  });

  test('POST: Failed registration with a missing password', async () => {
    const email = apiFactory.getRandomEmailAndPassword().email;
    const { response, info } =
      await test.step('Send request to create user with missing password', async () => {
        const res = await authClient.register(email);
        return { response: res, info: await res.json() };
      });
    expect(response.status()).toBe(400);
    expect(info).toMatchObject(errorSchema);
  });

  test('POST: Successful login; verify token is returned', async () => {
    const { email, password } = apiFactory.getRandomEmailAndPassword();
    const { response, info } =
      await test.step('Send request to login user', async () => {
        const res = await authClient.login(email, password);
        return { response: res, info: await res.json() };
      });
    expect(response.status()).toBe(200);
    expect(info).toMatchObject(loginSchema);
  });

  test('POST: Failed login with missing credentials', async () => {
    const email = apiFactory.getRandomEmailAndPassword().email;
    const { response, info } =
      await test.step('Send request to login user with missing credentials', async () => {
        const res = await authClient.login(email);
        return { response: res, info: await res.json() };
      });
    expect(response.status()).toBe(400);
    expect(info).toMatchObject(errorSchema);
  });
});

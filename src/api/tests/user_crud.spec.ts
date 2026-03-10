import { test, expect } from '@playwright/test';

import { UserClient } from '../clients/userClient';
import {
  userCreateSchema,
  userListSchema,
  userUpdateSchema,
  validateUserData
} from '../schemas/userSchemas';

import { apiFactory } from '../../utils/apiFactory';

test.describe('@A1 @API - CRUD Operations', () => {
  let userClient: UserClient;

  // Gives the baseURL to the API context before each test
  test.beforeEach(async ({ request, baseURL }) => {
    userClient = new UserClient(request, baseURL || '');
  });

  test('GET: Verify response status, pagination structure, and that the returned user list is not empty', async () => {
    const page = 2;
    const { response, info } = await userClient.getUsersList(`page=${page}`);

    await test.step('Verify response status', async () => {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });

    await test.step('Returned user list is not empty', async () => {
      expect(info.data.length).toBeGreaterThan(0);
    });

    await test.step('Verify pagination structure', async () => {
      expect(info.page).toBe(page);
      expect(info.data).not.toBeNull();

      // Ignore 'structure' and '_meta'
      expect(info).toMatchObject(userListSchema);

      // Validate each user object in the data and check that the email field follows the expected format and that the avatar URL is correct
      for (const user of info.data) {
        expect(user).toBeDefined();
        expect(user).toMatchObject(validateUserData(user));
      }
    });
  });

  test('GET: Verify a single users data structure and validate specific fields', async () => {
    // Get the list of users to randomly select a user ID for the single user test
    const page = apiFactory.getRandomPage();
    const { info: listInfo } = await userClient.getUsersList(`page=${page}`);
    const targetId =
      listInfo.data[Math.floor(Math.random() * listInfo.data.length)].id;

    const { response: userResponse, info: userInfo } =
      await userClient.getUser(targetId);

    await test.step('Verify response status', async () => {
      expect(userResponse.status()).toBe(200);
    });

    await test.step('Verify data structure', async () => {
      expect(userInfo).not.toBeNull();

      expect(userInfo.data).toBeDefined();
      expect(userInfo.data).toMatchObject(validateUserData(userInfo.data));
    });
  });

  const userDatasets = [
    { name: 'John Doe', job: 'QA Engineer' },
    { name: 'Jane Smith', job: 'Fullstack Dev' },
    { name: 'Carlos Silva', job: 'Product Owner' }
  ];
  for (const user of userDatasets) {
    test(`Data-Driven POST: Create user ${user.name} with role: ${user.job}`, async ({}) => {
      // Adding a delay to avoid hitting rate limits on the API during test runs
      await new Promise((res) => setTimeout(res, 2000));
      const { response, info } = await userClient.createUser(
        user.name,
        user.job
      );
      expect(response.status()).toBe(201);

      // Validate the response structure and that it includes the submitted name and job, plus a generated id and timestamp
      expect(info).toMatchObject({
        ...userCreateSchema,
        name: user.name,
        job: user.job
      });
      const today = new Date().toISOString().split('T')[0];
      expect(info.createdAt).toContain(today);
    });
  }

  test('PUT: Update an existing user and validate the response reflects the changes', async () => {
    const randomData = apiFactory.generateUserData();
    const pageNumber = apiFactory.getRandomPage();
    const { name, job } = randomData;

    const { response: listResponse } = await userClient.getUsersList(
      `page=${pageNumber}`
    );
    const { data: users } = await listResponse.json();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const targetId = randomUser.id;
    const old_name = `${randomUser.first_name} ${randomUser.last_name}`;

    const { response: updateResponse, info: updateInfo } =
      await userClient.updateUser(targetId, name, job);

    await test.step('Verify response status', async () => {
      expect(updateResponse.status()).toBe(200);
    });

    await test.step('Verify response includes submitted name, job, timestamp and not the old name', async () => {
      expect(updateInfo).toMatchObject({
        ...userUpdateSchema,
        name: name,
        job: job
      });
      expect(updateInfo.name).not.toBe(old_name);
      const today = new Date().toISOString().split('T')[0];
      expect(updateInfo.updatedAt).toContain(today);
    });
  });

  test('DELETE: Verify the response returns a 204 status code', async () => {
    const page = apiFactory.getRandomPage();
    const { response: listResponse } = await userClient.getUsersList(
      `page=${page}`
    );
    const listBody = await listResponse.json();
    const targetId =
      listBody.data[Math.floor(Math.random() * listBody.data.length)].id;
    const { response: deleteResponse } = await userClient.deleteUser(targetId);

    await test.step('Verify response status', async () => {
      expect(deleteResponse.status()).toBe(204);
      const body = await deleteResponse.text();
      expect(body).toBe('');
    });
  });
});

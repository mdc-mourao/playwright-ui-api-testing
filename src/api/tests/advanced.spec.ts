import { test, expect } from "@playwright/test";
import { UserClient } from "../clients/userClient";
import { userSchema } from "../schemas/advancedSchemas";
import { validateSchema } from "../clients/advancedClient";

test.describe('@A3 @API - Advanced Schema Validation Tests', () => {
    let userClient: UserClient;

    // Gives the baseURL to the API context before each test 
    test.beforeEach(async ({ request, baseURL }) => {
        userClient = new UserClient(request, baseURL || '');
    });
    
    test('GET: Verify a non found response', async() => { 
        const { response, info } = await userClient.getUser(0);
        
        await test.step('Verify response status', async() =>  {
            expect(response.status()).toBe(404);
        });

        await test.step('Verify data structure', async() =>  {
            expect(info).toMatchObject({});
        });
    });

    test('GET: Reasonable timeout and that data is still valid', async() => {
        test.setTimeout(10000);
        const startTime = Date.now();
        await userClient.getUsersList('delay=3');
        const endTime = Date.now();
        const duration = (endTime - startTime);

        expect(duration).toBeLessThan(5000);
    });

    test('GET: Validate User details with AJV Schema', async () => {
        const { response, info } = await userClient.getUser(2);
        expect(response.status()).toBe(200);
        validateSchema(userSchema, info);
    });
});



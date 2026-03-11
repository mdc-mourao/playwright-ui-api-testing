import { APIRequestContext } from '@playwright/test';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async register(email?: string, password?: string) {
    return await this.request.post('/api/register', {
      data: { email, password }
    });
  }

  async login(email?: string, password?: string) {
    return await this.request.post('/api/login', {
      data: { email, password }
    });
  }
}

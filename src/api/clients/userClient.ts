import { APIRequestContext } from '@playwright/test';

export class UserClient {
  constructor(
    private request: APIRequestContext,
    private baseURL: string
  ) {}

  async getUsersList(params: string) {
    return await this.safeRequest('get', `api/users?${params}`);
  }

  async getUser(id: number) {
    return await this.safeRequest('get', `api/users/${id}`);
  }

  async createUser(name: string, job: string) {
    return await this.safeRequest('post', `api/users`, { name, job });
  }

  async updateUser(id: number, name: string, job: string) {
    return await this.safeRequest('put', `api/users/${id}`, { name, job });
  }

  async deleteUser(id: number) {
    return await this.safeRequest('delete', `api/users/${id}`);
  }

  private async safeRequest(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ) {
    const fullUrl = this.baseURL.endsWith('/')
      ? `${this.baseURL}${url}`
      : `${this.baseURL}/${url}`;
    try {
      const response = await this.request[method](fullUrl, { data });
      const errorText = await response.text();
      const info = errorText ? JSON.parse(errorText) : {};
      return { response, info };
    } catch (error: any) {
      console.error(`Request Error: ${error.message}.`);
      throw error;
    }
  }
}

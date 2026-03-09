import { expect } from '@playwright/test';

export const registerSchema = {
  id: expect.any(Number),
  token: expect.any(String),
};

export const errorSchema = {
  error: 'Missing password',
};

export const loginSchema = {
  token: expect.any(String),
};

import { expect } from '@playwright/test';

export const userListSchema = {
    page: expect.any(Number),
    per_page: expect.any(Number),
    total: expect.any(Number),
    total_pages: expect.any(Number),
    data: expect.any(Array)
};

export const validateUserData = (user: any) => {
    const firstNameLow = user.first_name.toLowerCase();
    const lastNameLow = user.last_name.toLowerCase();
    const expectedAvatar = `https://reqres.in/img/faces/${user.id}-image.jpg`;
    const emailRegex = new RegExp(`^${firstNameLow}\\.${lastNameLow}@([\\w-]+\\.)+[\\w-]{2,4}$`);

    return {
        id: expect.any(Number),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.stringMatching(emailRegex),
        avatar: expectedAvatar
    };
};

export const userCreateSchema = {
    name: expect.any(String),
    job: expect.any(String),
    id: expect.stringMatching(/^\d+$/),
    createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
};

export const userUpdateSchema = {
    name: expect.any(String),
    job: expect.any(String),
    updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
};



# 🚀 API and UI Automation Suite
This project is a high-level automation framework focused on UI and API testing. 
It was designed to demonstrate modern QA Engineering practices, such as the Page Object Model (POM), environment isolation, and CI/CD integration.

API testing framework designed for the [ReqRes.in](https://reqres.in/). This project implements contract testing, dynamic business logic validation, and cross-browser execution.

## Prerequisites:
 - Node.js 
 - Git

## How to install:
 ### 1st clone the repository
   - git clone https://github.com/mdc-mourao/playwright-ui-api-testing.git
   - cd playwright-ui-api-testings
 ### 2nd install dependencies:
   - npm install
 ### 3rd install Playwright browsers
   - npm init playwright@latest
 ### 4th install dotenv library  
   - npm install dotenv --save-dev
 ### 5th install AJV library  
   - npm install ajv
   - npm install ajv ajv-formats
   - npm install better-ajv-errors
 ### Optional
   - Install Visual Studio Code and install the extension "Playwright"

## Environment Configurations
 1. Locate the .env.example file in the root securely
 2. Create a copy and rename it to .env
 3. Fill in the `BASE_URL`, `USER_NAME`, `PASSWORD` and `API_KEY` with the provided test credentials.

## Design Decisions
### Project Structure
```text
src/
├── api/
│   ├── clients/ # API request abstractions
│   ├── schemas/ # AJV JSON Schemas & Validation Logic
│   └── tests/   # Spec files
└── utils/       # Factories
```

## How to run the tests
To run all tests (UI and API):
 - npx playwright test

To run only API tests:
 - npx playwright test --grep='API'

Or by section where `_` is the number of the section [1, 2, 3]
 - npx playwright test --grep='A_'

## Technical Highlights
### 1. Advanced Schema Validation (AJV)
We use **AJV (JSON Schema Validator)** to enforce API contracts. 
- Strict type checking (e.g., IDs must be `numbers`, emails must be `strings`).
- Prevention of unexpected fields using `additionalProperties: false`.
### 2. Dynamic Business Logic Oracle
Instead of hardcoded values, our `validateUserData` builder implements:
- **Email Masking:** Validates if the email follows the `firstname.lastname@reqres.in` pattern via RegEx.
- **Avatar Matching:** Ensures the avatar URL contains the correct User ID.
### 3. CI/CD Pipeline
Integrated with **GitHub Actions**, automatically running the suite on every `push`. It securely handles environment variables using **GitHub Secrets**.

## Assumptions made







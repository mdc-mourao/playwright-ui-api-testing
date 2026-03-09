# 🚀 API and UI Automation Suite

This project is a high-level automation framework focused on UI and API testing.
It was designed to demonstrate modern QA Engineering practices, such as the Page Object Model (POM), environment isolation, and CI/CD integration.

API testing framework designed for the [ReqRes.in](https://reqres.in/). This project implements contract testing, dynamic business logic validation, and cross-browser execution.

## Prerequisites:

- Node.js
- Git
- Docker

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

1.  Locate the .env.example file in the root securely
2.  Create a copy and rename it to .env
3.  Fill in the `BASE_URL`, `USER_NAME`, `PASSWORD` and `API_KEY` with the provided test credentials.

## Design Decisions

### Project Structure

```text
src/
├── api/
│   ├── clients/ # API request abstractions
│   ├── schemas/ # AJV JSON Schemas & Validation Logic
│   └── tests/   # Spec files
├── ui/
│   ├── fixtures/ # test infrastructure
│   ├── pages/    # ui helpers and business logic
│   └── tests/    # Spec files
└── utils/        # Factories
```

## How to run the tests

The test suite for UI is configured to support Chromium, Firefox and WebKit and it's configurated to run with 4 workers in parallel.
In total there are 20 UI tests (60 with cross-browsing) and 14 API tests.
To run all tests (UI and API):

- npx playwright test

To run only API/UI tests:

- Available projects: Available projects: "UI-Chromium", "UI-Firefox", "UI-WebKit", "API-Tests"
- npx playwright test --project='API-Tests'
- npx playwright test --project='UI-Chromium' (runs UI tests only through Chromium)
- npx playwright test --grep='UI' (runs UI tests in every configurated browser)

Or by section (A or B) where `_` is the number of the section [1, 2, 3], eg

- npx playwright test --grep='A3'

## How to generate test report

- npx playwright show-report (Playwright HTML Default)

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

Integrated with **GitHub Actions**, automatically running API tests and UI tests in Chromium on every `push` for faster CI execution. It securely handles environment variables using **GitHub Secrets**.

### 4. Report Allure

- We need to install the dependency `npm install --save-dev allure-playwright`
- Add the report in the `playwright.config.ts`
- And after a execution run `npx allure serve allure-results`, it will automatically open the report
- If you want to generate a report you can do so by running:

  `npx allure generate allure-results -o allure-report --clean`

  `npx allure open allure-report`

### 5. Docker Image 🐳

Docker is configurated to run only API tests and UI using Chromium only (`docker-compose up`)but can be changed with the following commands in the terminal:

1.  Run all testes and Generate a report (API and UI cross-browsing):

- docker compose run --rm playwright sh -c "npm ci && npm run test:all"
- npx allure serve allure-results

2.  Run a specific set of tests (test:api, test:ui and test:chromium - package.json > scripts):

- docker compose run --rm playwright sh -c "npm ci && npm run test:chromium"

Once the tests finish, the results are synced to the allure-results folder on your machine, just run the command to generate it.

### 6. Linting and Formatting

This project uses **ESLint** for code quality analysis and **Prettier** for automatic code formatting. These tools ensure code consistency, identify bad practices, and maintain a uniform code style across the project.

#### How It Works:
- **ESLint**: Analyzes your code to identify syntax errors, best practice violations, and style inconsistencies (e.g., unused variables, missing return types).
- **Prettier**: Automatically formats code to maintain consistent styling (spaces, quotes, line breaks, indentation).
- **Husky + lint-staged**: Automatically runs linting/formatting on staged files before each commit, preventing poorly formatted code from being committed.

#### Available Commands:
- `npm run lint` — Scans the entire codebase for code quality issues and displays them without modifying files.
- `npm run lint:fix` — Automatically fixes ESLint issues and formats all files with Prettier (spaces, quotes, indentation, etc.).
- `npm run lint:report` — Generates an HTML report of linting issues saved as `lint-report.html`.
- `npm run format` — Formats code with Prettier only (without ESLint analysis).

#### Configuration:
- **ESLint config**: `eslint.config.mjs` — Defines rules for TypeScript, JavaScript, and code quality standards.
- **Prettier config**: `.prettierrc` — Specifies formatting preferences (semicolons, quotes, print width, etc.).
- **Pre-commit hook**: `.husky/pre-commit` — Automatically runs `lint-staged` before commits.

#### Workflow:
1. Stage your changes: `git add src/...`
2. Commit: `git commit -m "message"` — Husky automatically runs linting on staged files.
3. If formatting issues are found, fix them with `npm run lint:fix` and commit again.
4. Or manually run linting anytime: `npm run lint` or `npm run lint:fix`

## Known Issues

### Test Environment (OrangeHRM Demo)

Due to the nature of the public demonstration instance used for UI testing, the following external behaviors have been identified:

#### Server Instability

Occasionally, the site may become unavailable (HTTP 503/404) or extremely slow due to automated server resets or high concurrent traffic.
To improve stability in the OrangeHRM demo environment, navigation uses: `waitUntil: "domcontentloaded"` and a 1 minute timeout (which did the trick :D).

This strategy ensures that tests proceed once the HTML document has been fully parsed.
Running all browsers in parallel may therefore lead to intermittent timeouts that are environment-related rather than test-related.

For more stable execution during evaluation, it is recommended to run the tests using Chromium only:

- npx playwright test --project="UI-Chromium"

## Assumptions made
d to run the tests using Chromium only:
 - npx playwright test --project="UI-Chromium"

## Assumptions made







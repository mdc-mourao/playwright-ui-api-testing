# 🚀 API and UI Automation Suite

This project is a high-level automation framework focused on UI (OrangeHRM) and API (ReqRes.in) testing.
It was designed to demonstrate modern QA Engineering practices, such as the Page Object Model (POM), environment isolation, and CI/CD integration.

This project implements contract testing, dynamic business logic validation, and cross-browser execution.

## Prerequisites:

- Node.js
- Git
- Docker
- Java (required for allure reports)

## Tech Stack

- Playwright
- TypeScript
- AJV (JSON Schema Validation)
- Dotenv (Environment Configuration)
- Allure Reporter
- Docker
- GitHub Actions
- ESLint + Prettier + Husky

## 📦 How to install:

### 1st clone the repository

    git clone https://github.com/mdc-mourao/playwright-ui-api-testing.git
    cd playwright-ui-api-testing

### 2nd install dependencies:

**Note: This will automatically install Playwright, AJV, Dotenv, and Allure as defined in the package.json**

    npm install
    npx playwright install --with-deps

### Optional

    Install Visual Studio Code and install the extension "Playwright"

## Environment Configurations

1.  Locate the .env.example file in the root securely
2.  Create a copy and rename it to .env
3.  Fill in the `BASE_URL`, `USER_NAME`, `PASSWORD` and `API_KEY` with the provided test credentials.

## Design Decisions

### 📂 Project Structure

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

### 🛠️ Key Design Patterns Applied

1. **Hybrid Testing Approach (API + UI)**: API tests provide fast feedback on core business logic and UI tests ensure end-to-end user journey integrity.
2. **POM & Fixtures**: Implementation of POM for Login, Dashboard, and PIM pages with fixtures.
3. **Resilience to Environment Instability**: No hardcoded sleeps, just explict waits.
4. **Containerization with Docker**: to help with different environment, such us locally and CI (GitHub Actions)
5. **Visual Regression Strategy**: Full-page screenshots would cause false negatives because of the dynamic changes. Selective screenshotting provides visual security.

## How to run the tests

The UI test suite supports Chromium, Firefox and WebKit and runs with 4 workers in parallel.
In total there are 20 UI tests (60 with cross-browsing) and 14 API tests.

To run all tests (UI and API):

```
 npx playwright test
```

To run only API/UI tests:

- Available projects: "UI-Chromium", "UI-Firefox", "UI-WebKit", "API-Tests"`

```
npx playwright test --project='API-Tests'
npx playwright test --project='UI-Chromium' (runs UI tests only through Chromium)
npx playwright test --grep='UI' (runs UI tests in every configurated browser)
```

Or by section (A or B) where `_` is the number of the section [1, 2, 3], e.g:

```
npx playwright test --grep='A3'
```

## 📂 How to generate test report

Playwright **HTML Default**:

```
npx playwright show-report
```

Generate and open the **Allure** report

- If you have JAVA configurated in your PATH

```
npx allure open allure-report
```

- Or, you can use a HTTP server

```
npx http-server allure-report
http://127.0.0.1:8080
```

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

Integrated with **GitHub Actions**, automatically running API tests and UI tests in Chromium on every `push` and `pull_request` for faster CI execution, with 2 workers. It securely handles environment variables using **GitHub Secrets**.

And also with manual control **Workflow Dispatch**. Features a parameterized manual trigger that allows to choose a specific Test Scopes (API only, UI only, or specific browsers like Firefox/WebKit).

### 🐳 4. Docker Image

Docker is configured to run API tests, UI using Chromium only and automatically generate the Allure Report in the container(`docker-compose up --build`) but can be changed with the following commands in the terminal:

1.  Run all tests and Generate a report (API and UI cross-browsing):

```
docker compose run --rm playwright sh -c "npm run test:api || true && npm run report:generate"
```

2.  Run a specific set of tests (e.g. test:api, test:ui and test:chromium - package.json > scripts):

```
docker compose run --rm playwright sh -c "npm run test:chromium || true && npm run report:generate"
```

Once the tests finish, the results are synced to the **allure-results** folder on your machine, just run the command to generate it.

### 5. Linting and Formatting

This project uses **ESLint** for code quality analysis and **Prettier** for automatic code formatting. These tools ensure code consistency, identify bad practices, and maintain a uniform code style across the project.

#### How It Works:

- **ESLint**: Analyses your code to identify syntax errors, best practice violations, and style inconsistencies (e.g., unused variables, missing return types).
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

Due to the unstable nature of the OrangeHRM demo environment, where global users frequently change the system language, this framework avoids assertions based on UI text strings (like menu names or titles). Instead, it prioritizes robust selectors (like ARIA roles, test IDs, or data attributes) and validates element visibility and URL states. This strategy prevents 'flaky tests' and false negatives caused by localization changes, ensuring the suite remains green regardless of the environment's current language setting.

Occasionally, the site may become unavailable (HTTP 503/404) or extremely slow due to automated server resets or high concurrent traffic.
To improve stability in the OrangeHRM demo environment, navigation uses: `waitUntil: "domcontentloaded"` and a 1 minute timeout (which did the trick :D).

This strategy ensures that tests proceed once the HTML document has been fully parsed.
Running all browsers in parallel may therefore lead to intermittent timeouts that are environment-related rather than test-related.

For more stable execution during evaluation, it is recommended to run the tests using Chromium only:

```
npx playwright test --project="UI-Chromium"
```

## Assumptions made

1. **Environment Volatility & Performance**

The OrangeHRM demo environment is a shared public sandbox that suffers frequent resets and manual data changes by other users. Assume that any data created (Employees, Users) might be deleted or modified.

The server response time is highly unstable, with observed latencies exceeding 15-20 seconds for initial page loads and API responses.

2. **Docker**

The evaluator has Docker and Docker-compose installed for "out-of-the-box" execution.

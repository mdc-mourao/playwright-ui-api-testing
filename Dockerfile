FROM mcr.microsoft.com/playwright:v1.58.2-jammy

RUN apt-get update && apt-get install -y default-jre

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g allure-commandline

COPY . .

CMD ["npx", "playwright", "test"]
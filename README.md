# Autotests for Frontend apps

Nodejs is required to run the frontend tests, currently use version 18 (but it works at least from 16 version):

```
https://nodejs.org/en/download/
```

For nodejs version management use nvm. To install precise node version run

```sh
nvm install {NODEJS_VERSION}
nvm use {NODEJS_VERSION}
```

Then install typescript globally (may need sudo)

```sh
npm install -g typescript
```

Before running the tests install the dependencies running

```sh
npm install 
```

After packages are installed install playwright browsers by running

```sh
npx playwright install
```

Copy file .env.example to .env. Change BASE_URL variable if necessary


## Command line parameters

Tests are running in headless distributed (parallelized on various workers) mode using command with appropriate browser

```sh
npm run tests:chrome  
```


Generate allure report after the test run

```
npx allure serve allure-results
```
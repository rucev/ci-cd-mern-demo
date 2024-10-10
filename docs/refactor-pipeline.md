# Refactor the Pipelines

Just like with code, even after your pipeline works, you can still improve it. Refactoring your CI/CD pipelines can make them more efficient, readable, and maintainable. Below, we’ll walk through how to refactor both the **app** and **API** pipelines, breaking down what changes were made and why.

## App Pipeline

Here is the original app pipeline, which deploys the frontend app on Netlify:

### Before Refactor

```yml
name: Deploy App on Netlify

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploying Project

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies, run tests, test build app
        run: |
          cd app
          npm install
          npm run test
          npm run build
          rm -r dist
          
      - name: Deploy App on Netlify
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID}}
        run: |
          npm install netlify-cli -g
          cd app
          touch netlify.toml
          echo '[build.environment]' > netlify.toml
          echo '  VITE_API_URL = "${{secrets.RENDER_API_URL}}"' >> netlify.toml
          netlify build
          netlify deploy --dir=./dist --prod
          rm netlify.toml
```
### Refactor

Here’s how we can improve the pipeline:

```yml
name: Deployment App on Netlify

on:
  push:
    branches:
      - main

jobs:
  deployment:
    runs-on: ubuntu-latest
    steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20

        - name: Install Dependencies
          run: npm i
          working-directory: app
        
        - name: Run Tests
          run: npm run test
          working-directory: app
        
        - name: Build App
          run: |
            npm run build
            rm -r dist
          working-directory: app

        - name: Deploy To Netlify
          env:
            NETLIFY_AUTH_TOKEN: ${{secrets.NETLIFY_AUTH_TOKEN}}
            NETLIFY_SITE_ID: ${{secrets.NETLIFY_SITE_ID}}
          run: |
            npm install netlify-cli -g
            touch netlify.toml
            echo '[build.environment]' > netlify.toml
            echo '  VITE_API_URL = "${{secrets.RENDER_API_URL}}"' >> netlify.toml
            netlify build
            netlify deploy --dir=./dist --prod
            rm netlify.toml
          working-directory: app
```

## API Pipeline

This is the original API pipeline, which deploys the backend on Render:

### Before Refactor

```yml
name: Deploy Api on Render

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploying Project

    services:
      mongodb:
        image: mongo:8
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies and run tests
        env:
          MONGODB_URI: mongodb://127.0.0.1:27017/ci-cd-mern-test
          PORT: 4321
          JWT_SECRET: irrelevant secret
          JWT_EXPIRATION: 2h
        run: |
          cd api
          npm install
          npm run test
          npm start & 
          sleep 15
          bash test.sh
```

### Refactor

```yml
name: Deploy Api on Render

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploying Project

    services:
      mongodb:
        image: mongo:8
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm install
        working-directory: api
      
      - name: Run Tests
        env:
          MONGODB_URI: mongodb://127.0.0.1:27017/ci-cd-mern-test
          PORT: 4321
          JWT_SECRET: irrelevant secret
          JWT_EXPIRATION: 2h
        run: |
          npm run test
          npm start &
          sleep 15
          bash test.sh
        working-directory: api

      - name: Deploy on Render
        run: |
          curl --request POST \
              --url https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys \
              --header 'accept: application/json' \
              --header 'content-type: application/json' \
              --header 'Authorization: Bearer ${{ secrets.RENDER_API_KEY }}' \
        working-directory: api
```

## Key Improvements:
- Working Directory: Working-directory was added to avoid repetitive `cd app`or `cd api` commands. This makes the script cleaner and reduces the risk of errors.
- Separation of Steps: We split the installation of dependencies, running tests, and building the app into separate steps. This makes it easier to understand the purpose of each task and troubleshoot in case of failure.

## Next Steps

Our pipelines look great! But what if we make multiple commits throughout the day and only push once? If that one push fails, valuable test feedback may be lost among all the changes. To prevent this, we’ll set up a pre-commit hook using Husky, which will run the tests before each commit is made. Let's see how to [set up a precommit hook](./precommit-hook.md).
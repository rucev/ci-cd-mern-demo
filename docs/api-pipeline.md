# Building the API Pipeline with GitHub Actions and Render

Before deploying our backend, we need to automate the execution of logic tests to ensure the code functions as expected. The initial steps will be similar to the frontend pipeline, but this time we will use Mocha and Chai for testing instead of Vitest. Additionally, since GitHub Actions allows us to run terminal commands, we can also automate our cURL tests.

## Automating cURL Tests with a Bash Script
If you're new to bash scripting, you might find this [bash cheat sheet](https://devhints.io/bash) helpful.

In our case, we have three tests, and to manually run them, we need to authenticate each time to obtain a token. To streamline this, we can automate the process, allowing the tests to run with a single command without manual authentication.

Here's an example of what the cURL tests would look like in a bash script:

```bash
set -e  # Exit immediately if a command exits with a non-zero status.

# Register the user
echo "Running register test..."
RESPONSE=$(curl -X POST http://localhost:4321/api/users \
    -H "Content-Type: application/json" \
    -d '{"email":"char@mail.com","password":"123456789"}' -s -w "%{http_code}" -o /dev/null)
if [ "$RESPONSE" -ne 204 ]; then
    echo "Register test failed with status code $RESPONSE"
    exit 1
fi

echo "Register test passed successfully"

# Authenticate the user and extract the token
echo "Running authenticate test..."
RESPONSE=$(curl -X POST http://localhost:4321/api/users/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"char@mail.com","password":"123456789"}' -s)

# Remove surrounding quotes if present
TOKEN=$(echo $RESPONSE | sed 's/"//g')

# Check if the token was extracted successfully
if [ -z "$TOKEN" ]; then
    echo "Failed to retrieve token"
    exit 1
fi

echo "Token saved successfully: $TOKEN"

# Use the token to retrieve the user's information
echo "Running retrieve test..."
RESPONSE=$(curl -X GET http://localhost:4321/api/users \
    -H "Authorization: Bearer $TOKEN" -s -w "%{http_code}" -o /dev/null)
if [ "$RESPONSE" -ne 200 ]; then
    echo "Retrieve test failed with status code $RESPONSE"
    exit 1
fi

echo "Retrieve test passed successfully"
```

## Setting up The pipeline

The initial setup is similar to the frontend pipeline, but this time we need to configure some additional steps, like using a [MongoDB](https://medium.com/@clemensstich/how-to-use-mongodb-in-github-actions-bf24a0d9adf3) service for our database and setting environment variables for our tests.

Here’s the initial configuration for the pipeline:

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
        image: mongo:8 # Use MongoDB Docker image for database
        ports:
          - 27017:27017  # Expose port for MongoDB connection

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
        run: | # The & and sleep 15 are needed to ensure that the terminal doesn't get stuck after starting up the local api
          cd api
          npm install
          npm run test
          npm start & 
          sleep 15
          bash test.sh

```

### MongoDB Setup
We will use a MongoDB service in the pipeline by pulling the MongoDB Docker image. But what exactly is this?

A *Docker image* is like a snapshot of a complete software environment. In this case, the MongoDB image contains everything needed to run MongoDB in an isolated environment. By running the image, we start a *container* (a lightweight, self-sufficient environment) that runs MongoDB for us.

In our pipeline, we expose port 27017 so that our backend application can communicate with MongoDB during tests, as if it were a live database.

## Adding Render Deployment

Although Render doesn’t provide a dedicated CLI for deployments, it offers an API that allows us to trigger deployments using a cURL command. You can find more information about the Render API in their [documentation](https://docs.render.com/api)

### Adding GitHub Secrets
To deploy the backend using Render, we need to configure the following GitHub secrets:
- Render API Key: Save your Render API key as a secret in your GitHub repository with the name RENDER_API_KEY. To retrieve this key go to your Render Dashboard and on the top left click in your profile. Here, go to *Account Settings* and *API Keys* to set a new key.
- Render Service ID: To retrieve your service ID you'll need to use the Render API itself. Access [this link](https://api-docs.render.com/reference/list-services) and add your token to get a list of all your services. Now, add your Render service ID as a secret with the name RENDER_SERVICE_ID.

### Deployment Pipeline
Once these secrets are in place, we need to do a cURL call to the Render API to trigger the deploy of our project. Let's see how this works in the [API documentation](https://api-docs.render.com/reference/create-deploy). With that, we can add the call to our pipeline:


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

      - name: Deploy on Render
        run: | # Trigger Render deployment via API
          cd api
          curl --request POST \
              --url https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys \
              --header 'accept: application/json' \
              --header 'content-type: application/json' \
              --header 'Authorization: Bearer ${{ secrets.RENDER_API_KEY }}' \
```

## Next Steps

Done it! Those are two perfectly functional pipelines, but does that mean we can not improve them even without adding new features? Obviously, it doesn't. [Let's see how we can refactor our pipelines](./refactor-pipeline.md).
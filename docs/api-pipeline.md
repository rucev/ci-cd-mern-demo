//TODO correct typos, fix format, etc


# Building the API pipeline

This time before running the deployment of our backend we want to run our logic tests. The initial steps to follow is the same. But, knowing that we can run anything we run on our command terminal... maybe we can automatice our curl tests too?

## Automate curl tests with a bash script

Before we start, if we have low experience with bash this might be a usefull [cheat sheet](https://devhints.io/bash).

Now, we have 3 tests and every time we test something we have to run an auth test to get a token. Let's automatize all this so when we run the script all the tests run alone without any help from us.

The curl tests all together in a single script will look something like that:

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

The inital steps are similar to the ones seen before

```yml
name: Deployment App

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
        - name: Whatever name you want
          run: #add commands here

```

But this time we run other tests and we set env variables for this tests. Besides, we need to install a Mongo image(https://medium.com/@clemensstich/how-to-use-mongodb-in-github-actions-bf24a0d9adf3)

safe render api key as a github secret
safe render service id as a github secret

## Add test command lines

If we add the following it will enter our app folder, install our dependencies and run all tests. 

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

If we push this and we go to our repository "Actions" sectionwe will see the pipeline running and the tests passing. We can change something to force the tests to fail and see how the pipeline reacts with that


## Add deployment

Render doesn't have a deploy uption on his CLI yet, but it has an api that works for that. With that api an a curl command we can deploy our backend. https://docs.render.com/api


```sh
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
        run: |
          cd api
          curl --request POST \
              --url https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys \
              --header 'accept: application/json' \
              --header 'content-type: application/json' \
              --header 'Authorization: Bearer ${{ secrets.RENDER_API_KEY }}' \
```
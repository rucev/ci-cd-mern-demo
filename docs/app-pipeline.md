# Building the App Pipeline with GitHub Actions and Netlify

The first step in our pipeline will be to run all component tests whenever changes are pushed to the repository. This ensures that any issues introduced by the changes are identified early, preventing broken features from being deployed.


## Setting up Github Actions

To build this pipeline we will use [Github Actions](https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-with-github-actions).

The first step is to create a `.github` folder in the root directory of the project. Inside this folder, create a subfolder called `workflows`.

Now, we have to create a `.yaml` file inside that will contain the steps that our project has to follow.

To start we will get the main structure out of Github Actions docs and then add the [Node Setup](https://github.com/actions/setup-node).

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
        - uses: actions/checkout@v4 # Pull the latest code
        - uses: actions/setup-node@v4 # Set up Node.js
          with:
            node-version: 20
        - name: Whatever name you want
          run: # You can add commands here

```

By doing this, we are running a virtual machine with Ubuntu. The commands specified under the `run` section will be executed in this virtual environment.


## Add test command lines

If we add the following it will enter our app folder, install our dependencies and run all tests.

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
        
        - name: Install dependencies, run tests, test build app
          run: |
            cd app
            npm install
            npm run test
            npm run build
```

After pushing the changes, navigate to the *Actions* tab in your GitHub repository to see the pipeline running and tests being executed.


## Add build and deployment

With the ability to run commands in our pipeline established, we can now integrate [Netlify CLI](https://docs.netlify.com/cli/get-started/) to [deploy our app](https://cli.netlify.com/commands/deploy) automatically.

There are a few things we will need to do before our deployment. We need to add GitHub secrets to securely store sensitive data like API tokens and site IDs.

In the Netlify dashboard, click on your user avatar, navigate to *User Settings* and select *OAuth*. Here, you can generate a personal access token.

Click on new and set your expiration date and a name for the token. Once it's done, copy-paste it somewhere safe.

Now navigate to your github repository settings. And go to secrets and variables, click on Actions and add a New Repository Secret. In the Secret field paste your token and give him a name (like NETLIFY_AUTH_TOKEN).

Now let's go back to netlify to get our site Id. Back on the dashboard, select your site configuration and on site details you will see the site ID copy and add it as a new github secret.

Then, we will need to set up our api url as a secret too, to be able to configure our build environment variables.

According to netlify docs, this variable has to be inside a file named `netlify.toml`. We don't want this file to be pushed to our repository, just as we don't want any .env file to. That's why we will create the file through command lines and, once the build is done, remove it.

Now, having this and having read a bit of how the Netlify CLI works, we can automate our pipeline to deploy the frontend only if our tests pass:

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
          
      - name: Deploy App on Netlify # Deploy only if tests pass
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

## Next Steps:

Next, we’ll focus on building our [backend pipeline](./api-pipeline.md) to complete the deployment process.
//TODO correct typos, fix format, etc


# Building the APP pipeline

The first step we will add to our pipeline is to run all of our components tests when we push any change to our repository. This way, if we break something that it use to work, we will know before it deploys.


## Setting up Github Actions

To build this pipeline we will use [Github Actions](https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-with-github-actions).

The fisrt step is to create a `.github` folder on our root folder and, inside this one, a `workflows`folder.

Now, we have to create a `.yaml` file inside that will contain the steps that our project has to follow.

First of all we will get the main structure out of Github Actions docs and then add the [Node Setup](https://github.com/actions/setup-node).

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

When we do this we are running a virtual machine with ubuntu. The commands we set on the run line will be executed on that machine.


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
        
        - name: Install dependencies & run tests
          run: |
            cd app
            npm install
            npm run test
```

If we push this and we go to our repository "Actions" sectionwe will see the pipeline running and the tests passing. We can change something to force the tests to fail and see how the pipeline reacts with that


## Add build and deployment

Now that we know that we can use commands on the pipeline, we can use [Netlify CLI](https://docs.netlify.com/cli/get-started/) to add the [deployment to our app](https://cli.netlify.com/commands/deploy). For this, we will need to add some github secrets to our repository too.

The 2 things we will need for our deployment are our Netlify token and our Netlify Site Id.

While on Netlify dashboard we need to click on our user avatar go to user setting and and OAuth to get our personal access token.

Click on new and set your expiration date and a name for the token. Once it's done, copy-paste it somewhere safe.

Now navigate to your github repository settings. And go to secrets and variables, click on Actions and add a New Repository Secret. In the Secret field paste your token and give him a name (like NETLIFY_AUTH_TOKEN).

Now let's go back to netlify to get our site Id. Back on the dashboard, select your site configuration and on site details you will see the site ID copy and add it as a new github secret.

Now, having this and having read a bit of how the Netlify CLI works, we can automate our pipeline to deploy the frontend oly if our tests pass:

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
        run: | # We add the build command so the code compiles
          cd app
          npm install
          npm run test
          npm run build
          
   
      - name: Deploy App on Netlify
          env:
            NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
            NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID}}
          run: |
            npm install netlify-cli -g
            cd app
            netlify deploy --dir=./dist --prod


```

## Next Steps:

Now we can go to build our backend pipeline
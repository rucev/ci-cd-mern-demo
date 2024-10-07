# Adding a Pre-Commit Hook with Husky
In a CI/CD pipeline, running tests after pushing code to the repository is essential. But what if we could catch errors even before pushing our code? By adding a pre-commit hook with [Husky](https://typicode.github.io/husky/get-started.html), we can automatically run tests locally every time we try to commit code. This way, we can prevent committing broken code and ensure quality before changes are even sent to the repository.

## What is a Pre-commit hook?

A pre-commit hook is a script that runs automatically before a Git commit is finalized. In this case, we'll set it up so that before you commit any code, your project's tests (both frontend and backend) will run. If any test fails, the commit will be blocked, and you'll need to fix the issue before proceeding.

## Setting Up Husky

We'll use Husky to create the pre-commit hook. Husky is a tool for managing Git hooks, which allows you to automatically run scripts at different stages of the Git process (e.g., pre-commit, pre-push).

Here’s how to set it up:

1. **Install Husky:** First, we need to install Husky as a development dependency in your project.
```sh
npm install --save-dev husky
```

2. **Initialize Husky:** After installing, initialize Husky to create the necessary configuration files.
```sh
npx husky init
```

This command will create a `.husky/` folder in the root of your project, where the Git hooks will be stored.

3. **Add Pre-Commit Script:** Now, we want to add a script that runs our tests before every commit. To do this, we’ll create a `pre-commit` file inside the `.husky` directory and add the following script to it.

4. **Writing the Pre-Commit Script:** Now, inside `.husky/pre-commit`, you can add the following script to run both frontend and backend tests whenever you commit code:

```sh
cd app
npm run test

cd ../api
npm run test
```

This script does the following:

- Navigates to the app folder (where your frontend lives) and runs npm run test to execute all frontend tests.
- Then, it moves to the api folder (your backend) and runs npm run test to execute all backend tests.

If any of these tests fail, Husky will prevent you from committing your code, giving you immediate feedback on potential issues.

## Benefits of Pre-Commit Hooks

By adding this pre-commit hook, you ensure that:
- No code with broken tests gets committed.
- Your test suite is always up-to-date and running regularly.
- The risk of introducing bugs into the codebase is minimized.

This step integrates an additional layer of quality control in your workflow, complementing your CI/CD pipeline and providing faster feedback before code even hits the remote repository.

## Next Steps

Now that you've successfully set up a pipeline that runs on every push and integrated a pre-commit hook to test your code on every commit. These are essential steps toward maintaining code quality and automating your development process. From here, you can [learn more](./next-steps.md) more about CI/CD practices, explore more advanced features of Husky, and further improve yourpipelines with additional tools and optimizations.
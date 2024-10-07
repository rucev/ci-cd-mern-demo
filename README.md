# CI/CD for MERN Stack Demo

## About

This repository is an introduction to the main concepts of CI/CD (Continuous Integration and Continuous Delivery), with a step-by-step guide on how to apply it to a MERN (MongoDB + Express + React + Node) project.

The goal of this project is to provide a hands-on introduction to setting up automated pipelines, testing, and deployment using GitHub Actions, Netlify, Render and Mongo Atlas.

## Project structure

This project is a simple full-stack app with login management through JWT, allowing users to register, log in, and receive a personalized welcome message.

The project consists of three main folders:

### API
The backend of the project is built with Node.js and Express, managing user login with JWT and handling API requests. Includes automated tests using Mocha, Chai, and cURL.

### APP
The frontend is a Vite + React app for user interaction, which includes Jest and Vitest tests for components and features.

### Common
Shared utilities between frontend and backend, such as error handling and validation logic.

## What To Do?

You can fork this repository or use your own project.

Follow the steps outlined in the guide to set up CI/CD for your project and automate its deployment.

## Content

1. [Introduction to CI/CD](./docs/introduction-to-ci-cd.md)
2. [Initial deploy of a MERN project](./docs/deploy-mern-project.md)
3. [Building the APP pipeline](./docs/app-pipeline.md)
4. [Building the API pipeline](./docs/api-pipeline.md)
5. [Adding a Pre-Commit Hook](./docs/precommit-hook.md)
6. [Keep Learning](./docs/keep-learning.md)
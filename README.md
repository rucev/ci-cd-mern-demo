# CI CD MERN DEMO

## About

This repository is an introduction to the main concepts of CI/CD (Continuous Integration and Continuous Delivery), with a step-by-step guide on how to apply it to a MERN (MongoDB + Express + React + Node) project.

## Project structure

This project is a very basic full-stack app with login management through JWT. You can create users to log in and receive a personalized welcome message from the app.

The project itself is divided into three folders:

1. One folder contains the API, where you can find the entire backend of the project, along with automated tests developed with Mocha, Chai, and some cURL tests to try the API endpoints without needing external software.

2. The next folder is the app folder, which contains a Vite + React frontend and some component tests built with Jest, Vitest, and Testing Library/React.

3. Finally, there's a common folder that contains errors and validators used in both the backend and frontend.

## Content

1. [Introduction to CI/CD](./docs/introduction-to-ci-cd.md)
2. [Initial deploy of a MERN project](./docs/deploy-mern-project.md)
3. [Building the APP pipeline](./docs/app-pipeline.md)
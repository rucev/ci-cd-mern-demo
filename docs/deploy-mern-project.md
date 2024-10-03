# Initial deploy of a MERN project

## Services

In this demo, we will use services with free tiers. The database will be hosted on MongoDB Atlas, while Render will be used for the API, and Netlify for the frontend. There are many other alternatives, but these services are well-suited for demonstration purposes.

## MongoDB Atlas: Hosting Our Database in the Cloud

We need to sign up or log in to [MongoDB Atlas](https://account.mongodb.com/account/login).

Once logged in, follow these steps to set up your project and cluster:
1. **Create a new cluster.**
2. **Set up database user and whitelist IPs:**

    Go to *Security Settings* → *Network Access*. Most free services use dynamic IPs, so for simplicity during initial setup or development, you can temporarily allow all IPs by setting the IP address to 0.0.0.0/0. This is less secure but common during development. For production environments, use more restrictive IP settings.
3. **Create a user:**

    You can either follow the instructions or go to Access Manager in the top navbar to create a database user.
4. **Get the MongoDB Connection String:**

    Go to *Connect*, choose *Drivers*, and select *Node.js*. You'll see a connection string like this:

`mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority`.

Replace <username> with the user you created and <password> with the user’s password.

### Local Testing

To test the setup locally, replace the MONGODB_URI in your .env file with the connection string and run a script like register.sh. You should see new entries in your MongoDB collections, confirming that the connection works.

Once the database is confirmed to work locally, we can move on to deploying the backend.

## Deploying the API with Render.

Next, create an account on [render](https://dashboard.render.com/login).

1. **Connect GitHub repository:**

    On the Render dashboard, click *Web Services* and connect your GitHub repository. You can use either private or public repositories, but if it's private, Render will ask for specific permissions.

2. **Set build settings:**

- Set the language to **Node.js** and the branch to the one where your API code is located (e.g., `main`).
- Since we have multiple folders in the repository, set the root directory for the API to `api`.
- Set the Build Command to `npm install` and Start Command to `npm start`. These commands should match those in your api `package.json`.

3. **Environment variables:**

    Choose the free tier and import your .env file for the API.

    Set the Mongo URI as the string from the previous step. Remember to also configure JWT secrets if needed.

4. **Set deployment options:**

    Open *Advanced Settings* and turn Auto-deploy to "No". While auto-deploy is useful, we will disable it here because we want to run tests before deploying, as part of our CI/CD pipeline.

5. **Deploy the API:**

    Click "Deploy Web Service" and wait for the deployment to finish. If your backend IP isn’t whitelisted, the deployment will fail, so make sure the IP is correctly set in MongoDB.

### Local Testing

Once deployed, you will see the API URL in the top left of Render’s dashboard. Use this URL to test the API by running the authentication curl test. Remember to replace the URL in the test with your Render API URL.

## Deploying the Frontend with Netlify

Create an account on [Netlify](https://app.netlify.com/) and follow these steps:

1. **Import repository:**

    On the dashboard, click *Add New Site* → *Import from GitHub*. Select your repository.

2. **Set build settings:**

- Set the root directory to `app`.
- Set the publish directory to `app/dist`.
- Set the build command to `npm run build`.

3. **Environment variable:**

    Add all environment variables. In this case we have to add a named VITE_API_URL and set it to the Render backend API URL.


Now click "Deploy". After the deployment finishes, your frontend should be live. If your project uses React Router, you might need to configure an extra step for handling routes. Follow the instructions in [this link](https://create-react-app.dev/docs/deployment/#netlify).

### Handling CORS Issues
If your app faces CORS issues, update your API configuration by adding this code to `api/index.js`:

```
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

/*rest of the code*/

api.use(cors(corsOptions));
```

Commit and push these changes, then manually redeploy your API. After this, the app should work without CORS problems.

## Next Steps

Now that the MERN app is successfully deployed, we can focus on automating testing and deployments using a CI/CD pipeline. Let's start with our [backend](./api-pipeline.md).
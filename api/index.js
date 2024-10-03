require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

const handlers = require('./handlers');

const mongoose = require('mongoose');

process.title = "api";

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        const api = express();
        const server = http.createServer(api);

        const jsonBodyParser = bodyParser.json();

        api.use(cors());

        api.get('/api', (req, res) => { res.send('Hello Api!') })

        api.post('/api/users', jsonBodyParser, handlers.registerUserHandler);

        api.post('/api/users/auth', jsonBodyParser, handlers.authenticateUserHandler);

        api.get('/api/users', handlers.retrieveUserHandler);

        server.listen(process.env.PORT, () => console.log(`server running in port ${process.env.PORT}`));

    })
    .catch((error) => {
        console.log('API ERROR:', error)
    })
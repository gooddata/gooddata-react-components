const express = require('express');
const bodyParser = require('body-parser');
const { factory } = require('@gooddata/gooddata-js');
const register = require('./register');
const assignProject = require('./assignProject');

require('dotenv').config();
// TODO validate env variables

const config = {
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    projectId: process.env.PROJECT_ID,
    userRole: process.env.USER_ROLE
};

const app = express();
const sdk = factory();

sdk.config.setCustomDomain(config.domain);

app.use(bodyParser.json());

[
    register,
    assignProject
].forEach(handler => handler(app, sdk, config));

app.listen(config.port);

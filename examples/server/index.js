const { factory } = require('@gooddata/gooddata-js');
const https = require('https');
const fs = require('fs');
const express = require('express');
const yup = require('yup');

const proxy = require('./endpoints/proxy');
const register = require('./endpoints/register');
const assignProject = require('./endpoints/assignProject');
const staticFiles = require('./endpoints/staticFiles');

require('dotenv').config();

const configSchema = yup.object().shape({
    port: yup.number().positive().integer().default(3009),
    serveFrom: yup.string().required(),
    https: yup.boolean().default(false),
    domain: yup.string().default('https://developer.na.gooddata.com'),
    username: yup.string().required(),
    password: yup.string().required(),
    projectId: yup.string().default('xms7ga4tf3g3nzucd8380o2bev8oeknp'),
    userRole: yup.number().positive().integer().default(3)
});

async function runServer() {
    const config = configSchema.cast({
        port: process.env.PORT,
        serveFrom: `${__dirname}/../dist/`,
        https: process.env.HTTPS,
        domain: process.env.DOMAIN,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        projectId: process.env.PROJECT_ID,
        userRole: process.env.USER_ROLE || 3
    });

    console.log('Server config', config); // eslint-disable-line no-console

    await configSchema.validate(config)
        .catch((reason) => {
            // eslint-disable-next-line no-console
            console.error(`Invalid config: ${reason}. You need to setup Node env variables USERNAME and PASSWORD
            for platform domain admin account. See examples/server/.env.sample and use it as a template for .env
            that should be created in root of this repo (not in examples/server)`);
            return process.exit(1);
        });

    const app = express();
    const sdk = factory();

    sdk.config.setCustomDomain(config.domain);

    const endpoints = [
        register,
        assignProject,
        proxy,
        staticFiles
    ];
    endpoints.forEach(handler => handler(app, sdk, config));

    if (config.https) {
        // openssl req -newkey rsa:2048 -nodes -keyout server.key -x509 -days 365 -out server.crt
        const options = {
            key: fs.readFileSync('./server.key'),
            cert: fs.readFileSync('./server.crt'),
            requestCert: false,
            rejectUnauthorized: false
        };
        https.createServer(options, app).listen(config.port, () => {
            console.log(`Listening on https://localhost:${config.port}...`); // eslint-disable-line no-console
        });
    } else {
        app.listen(config.port);
        console.log(`Listening on http://localhost:${config.port}...`); // eslint-disable-line no-console
    }
}

runServer();


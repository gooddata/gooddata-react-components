const { factory } = require('@gooddata/gooddata-js');
const https = require('https');
const fs = require('fs');
const express = require('express');

const proxy = require('./endpoints/proxy');
const register = require('./endpoints/register');
const assignProject = require('./endpoints/assignProject');
const staticFiles = require('./endpoints/staticFiles');
const getConfig = require('./utils/getConfig');

async function runServer() {
    const config = await getConfig()
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
        // Generate key and cert in root folder:
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


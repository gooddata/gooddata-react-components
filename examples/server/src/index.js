const { factory } = require('@gooddata/gooddata-js');
const https = require('https');
const fs = require('fs');
const express = require('express');

const proxy = require('./endpoints/proxy');
const register = require('./endpoints/register');
const assignProject = require('./endpoints/assignProject');
const staticFiles = require('./endpoints/staticFiles');
const redirectToHttps = require('./endpoints/redirectToHttps');

const config = {
    port: process.env.PORT,
    serveFrom: `${__dirname}/../../dist/`,
    https: process.env.HTTPS,
    domain: process.env.DOMAIN || 'https://developer.na.gooddata.com/',
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    projectId: process.env.PROJECT_ID,
    userRole: process.env.USER_ROLE || 3
};
console.log(`Examples-node-server config: ${JSON.stringify(config)}`); // eslint-disable-line no-console

const endpoints = [
    redirectToHttps,
    register,
    assignProject,
    proxy,
    staticFiles
];

const sdk = factory();
sdk.config.setCustomDomain(config.domain);

const app = express();
endpoints.forEach(handler => handler(app, sdk, config));

if (config.https) {
    // Generate key and cert in root folder: openssl req -newkey rsa:2048 -nodes -keyout server.key -x509 -days 365 -out server.crt
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

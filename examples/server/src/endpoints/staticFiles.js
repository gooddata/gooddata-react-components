const express = require('express');

function redirectAllToIndexHtml(req, res, next) { // TODO is there better way?
    req.url = '/index.html';
    next();
}

module.exports = (app, sdk, { serveFrom }) => {
    const staticServer = express.static(serveFrom, { redirect: false });

    app.use(staticServer);
    app.get('*', redirectAllToIndexHtml);
    app.use(staticServer);
    console.log(`Serving from ${serveFrom}`); // eslint-disable-line no-console
};

const express = require('express');

module.exports = (app, sdk, { serveFrom }) => {
    const staticServer = express.static(serveFrom, { redirect: false });

    app.use(staticServer);
    app.get('*', function(req, res, next){ req.url = '/index.html'; next(); }); // TODO is there better way?
    app.use(staticServer);
    console.log('Serving from ' + serveFrom);
};

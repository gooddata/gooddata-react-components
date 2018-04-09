var express = require('express');
var proxy = require('http-proxy-middleware');
var app = express();
var gdc = 'https://secure.gooddata.com';
var port = (process.argv[2] === '--port' && process.argv[3]) ? parseInt(process.argv[3]) : 3000;
var serveFrom = __dirname + '/dist/';

var proxySetting = {
    target: gdc,
    secure: false,
    cookieDomainRewrite: '',
    onProxyReq: (proxyReq) => {
        if (proxyReq.method === 'DELETE' && !proxyReq.getHeader('content-length')) {
            // Only set content-length to zero if not already specified
            proxyReq.setHeader('content-length', '0');
        }

        // White labeled resources are based on host header
        //proxyReq.setHeader('host', 'localhost:8999');
        proxyReq.setHeader('referer', gdc);
        proxyReq.setHeader('origin', null);
    }
};

app.use('/gdc', proxy(proxySetting));
app.use(express.static(serveFrom, { redirect: false }));

// TODO is there better way?
// ie. res.sendFile(serveFrom + '/index.html') doesnt send cache headers..
app.get('*', function(req, res, next){ req.url = '/index.html'; next(); });
app.use(express.static(serveFrom, { redirect: false }));

app.listen(port);
console.log('Serving from ' + serveFrom);
console.log('Listening on ' + port + "...");

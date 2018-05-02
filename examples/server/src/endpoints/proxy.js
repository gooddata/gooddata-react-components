const proxy = require('http-proxy-middleware');

module.exports = (app, sdk, { domain }) => {
    app.use('/gdc', proxy({
        target: domain,
        secure: false,
        cookieDomainRewrite: '',
        onProxyReq: (proxyReq) => {
            if (proxyReq.method === 'DELETE' && !proxyReq.getHeader('content-length')) {
                // Only set content-length to zero if not already specified
                proxyReq.setHeader('content-length', '0');
            }

            // White labeled resources are based on host header
            // proxyReq.setHeader('host', domain.replace(/^https?:\/\//, '').replace(/\/$/, ''));
            proxyReq.setHeader('referer', domain);
            proxyReq.setHeader('origin', null);

            // console.log("Proxying ", domain, proxyReq.path, proxyReq.query);
        }
    }));
};

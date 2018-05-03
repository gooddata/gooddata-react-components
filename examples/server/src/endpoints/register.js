const { pick } = require('lodash');
const bodyParser = require('body-parser');

const ALREADY_REGISTERED_ERROR_CODE = 'gdc1052';

module.exports = (app, sdk, { username, password }) => {
    if (!username || !password) {
        console.warn(`Set up USERNAME and PASSWORD for the /api/register endpoint to work.`)
    }

    app.post('/api/register', bodyParser.json(), (req, res) => {
        // eslint-disable-next-line no-console
        console.log('Server req /api/register');
        const { body } = req;
        if (!body) {
            return res.status(400).send('Missing body');
        }

        const keys = ['login', 'password', 'verifyPassword', 'firstName', 'lastName'];
        const missingKeys = keys.filter(f => !body[f]);
        if (missingKeys.length > 0) {
            return res.status(400).send(`Missing parameters: ${missingKeys.join(', ')}`);
        }

        return sdk.user.login(username, password).then(() => {
            const params = {
                accountSetting: pick(body, keys)
            };
            return sdk.xhr.post('/gdc/account/domains/developer/users', {
                body: JSON.stringify(params)
            }).then((result) => {
                const responseBody = JSON.parse(result.responseBody);
                res.status(201).json({
                    uri: responseBody.uri
                });
            });
        }).catch((err) => {
            console.log(err); // Log other errors to console
            if (err.responseBody) {
                const response = JSON.parse(err.responseBody);
                console.log('error response:', response);
                const { message, errorCode } = response.error;
                if (message) {
                    return res.status(400).json({
                        message,
                        errorCode
                    });
                }
            }

            return res.status(400).json({
                message: 'unknown error'
            });
        });
    });

    return app;
};

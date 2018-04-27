const { pick } = require('lodash');
const bodyParser = require('body-parser');

const ALREADY_REGISTERED_ERROR_CODE = 'gdc1052';

module.exports = (app, sdk, { username, password }) => {
    app.post('/gdc-register', bodyParser.json(), (req, res) => {
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
            if (err.responseBody) {
                const response = JSON.parse(err.responseBody);
                if (response.error.errorCode === ALREADY_REGISTERED_ERROR_CODE) {
                    return res.status(400).json({
                        message: response.error.message,
                        errorCode: 'gdc1052'
                    });
                }
            }

            console.log(err); // Log other errors to console
            return res.status(400).json({
                message: 'Unknown error'
            });
        });
    });

    return app;
};

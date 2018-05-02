const bodyParser = require('body-parser');

module.exports = (app, sdk, { username, password, projectId, userRole }) => {
    app.post('/gdc-assign-project', bodyParser.json(), (req, res) => {
        const { body } = req;
        if (!body) {
            return res.status(400).send('Missing body');
        }

        const keys = ['user'];
        const missingKeys = keys.filter(f => !body[f]);
        if (missingKeys.length > 0) {
            return res.status(400).send(`Missing parameters: ${missingKeys.join(', ')}`);
        }

        return sdk.user.login(username, password).then(() => {
            return sdk.xhr.post(`/gdc/projects/${projectId}/users`, {
                body: JSON.stringify({
                    user: {
                        content: {
                            status: 'ENABLED',
                            userRoles: [`/gdc/projects/${projectId}/roles/${userRole}`]
                        },
                        links: {
                            self: body.user
                        }
                    }
                })
            }).then(() => {
                return res.status(200).json({
                    status: 'success'
                });
            });
        }).catch((err) => {
            console.log(err); // Log all errors to console
            return res.status(400).json({
                message: 'Unknown error'
            });
        });
    });

    return app;
};


const yup = require('yup');
const path = require('path');
require('dotenv').config({
    path: path.resolve(process.cwd().replace(/\/examples/, ''), '.env')
});

const configSchema = yup.object().shape({
    port: yup.number().positive().integer().default(3009),
    serveFrom: yup.string().required(),
    https: yup.boolean().default(true),
    domain: yup.string().default('https://developer.na.gooddata.com'),
    username: yup.string().required(),
    password: yup.string().required(),
    projectId: yup.string().default('xms7ga4tf3g3nzucd8380o2bev8oeknp'),
    userRole: yup.number().positive().integer().default(3)
});

module.exports = () => {
    const config = configSchema.cast({
        port: process.env.PORT,
        serveFrom: `${__dirname}/../../../dist/`,
        https: process.env.HTTPS,
        domain: process.env.DOMAIN,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        projectId: process.env.PROJECT_ID,
        userRole: process.env.USER_ROLE || 3
    });
    console.log('Server config', config); // eslint-disable-line no-console
    const resolvedConfig = configSchema.validate(config).then(result => result);
    return resolvedConfig;
};

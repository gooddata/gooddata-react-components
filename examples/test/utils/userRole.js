// (C) 2007-2019 GoodData Corporation
import { Role, Selector, ClientFunction } from "testcafe";
import { config } from "./config";
import { loginUsingLoginForm } from "./helpers";

// Last time I checked, this didn't work. 2018-11-05
export const currentUser = Role(`${config.url}/login`, loginUsingLoginForm);

export const currentUser2 = redirectUrl => {
    return Role(`${config.url}/login`, TestController => {
        loginUsingLoginForm(redirectUrl)(TestController);
    });
};

export const currentUser3 = redirectUrl => {
    return Role(
        `${config.url}/login`,
        TestController => {
            loginUsingLoginForm(redirectUrl)(TestController);
        },
        { preserveUrl: true },
    );
};

// retries async check() untill it resolves or time runs out
const retry = async (check = async () => true, timeout = 1000, interval = 100, started = Date.now()) => {
    const startTime = Date.now();
    return check().catch(error => {
        return new Promise((resolve, reject) => {
            const resolveTime = Date.now();
            if (Date.now() + interval > started + timeout) {
                reject(error);
            }
            setTimeout(
                () => retry(check, timeout, interval, started).then(resolve, reject),
                Math.max(startTime - resolveTime + interval, 0),
            );
        });
    });
};

// returns a promise that is resolved with true when selector exists and rejected when it does not
// or the other way around if expectExist is false
export const selectorExists = (query, expectExist = true) =>
    new Promise(async (resolve, reject) => {
        const exists = await Selector(query).exists;
        if (exists === expectExist) {
            resolve(true);
        } else {
            reject();
        }
    });

const setCookie = ClientFunction(() => {
    document.cookie = "GDCAuthSST=b3htzvLME0V_7m_bPAS2Ef-UnqzJ-AAAABsZbdlOaEpwz_oEoY6ZilVkeFmN";
});

export const currentUser4 = Role(
    `${config.url}/login`,
    async tc => {
        // await setCookie();
        /* await retry(() => selectorExists(".s-isWaitingForLoggedInStatus", false), 15000).catch(error => {
        // eslint-disable-next-line no-console
        console.error("ERROR: s-isWaitingForLoggedInStatus forever. Probably a JS issue", error);
        // no reason to retry, something is most likely broken
    }); */

        await tc
            .typeText(".s-login-input-email", config.username, { paste: true, replace: true })
            .typeText(".s-login-input-password", config.password, { paste: true, replace: true })
            .click(".s-login-submit");

        // await tc.navigateTo(`${config.url}/attribute-filter-components`);

        await retry(() => selectorExists(".s-isLoggedIn", true), 3000).then(
            () => {
                // success: redirect
                return tc.navigateTo(`${config.url}/attribute-filter-components`);
            },
            error => {
                // eslint-disable-next-line no-console
                console.warn("failed to log in", error);
                // eslint-disable-next-line no-console
                console.warn("no more retries, sorry");
                return error;
            },
        );
    },
    { preserveUrl: true },
);

export const currentUser5 = Role(
    `${config.url}/login`,
    async tc => {
        // await setCookie();
        /* await retry(() => selectorExists(".s-isWaitingForLoggedInStatus", false), 15000).catch(error => {
        // eslint-disable-next-line no-console
        console.error("ERROR: s-isWaitingForLoggedInStatus forever. Probably a JS issue", error);
        // no reason to retry, something is most likely broken
    }); */

        await tc
            .typeText(".s-login-input-email", config.username, { paste: true, replace: true })
            .typeText(".s-login-input-password", config.password, { paste: true, replace: true })
            .click(".s-login-submit");

        // await tc.navigateTo(`${config.url}/attribute-filter-components`);

        /* await retry(() => selectorExists('.s-isLoggedIn', true), 3000).then(
        () => {
            // success: redirect
            return tc.navigateTo(`${config.url}/attribute-filter-components`);
        },
        error => {
            // eslint-disable-next-line no-console
            console.warn("failed to log in", error);
            // eslint-disable-next-line no-console
            console.warn("no more retries, sorry");
            return error;
        },
    ); */
    },
    { preserveUrl: true },
);

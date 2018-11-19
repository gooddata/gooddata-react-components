// (C) 2007-2018 GoodData Corporation

import * as Bluebird from 'bluebird';
import { isNil, keys, omitBy, snakeCase } from 'lodash';
import { SDK } from '@gooddata/gooddata-js';

const serializeMessage = (message: string, params: object) => (
    keys(omitBy(params, isNil)).reduce((result, key) => {
        const value = params[key];
        const logKey = snakeCase(key);

        return `${result} ${logKey}=${value}`;
    }, message)
);

function log( sdk: SDK, projectId: string, message: string, params: object ): Bluebird {
    const messages = [serializeMessage(message, params)];
    const uri = `/gdc/app/projects/${projectId}/log`;
    const data = { logMessages: messages };

    const xhr = sdk.xhr.post(uri, {
        method: 'POST',
        data: JSON.stringify(data)
    });

    // Handles sync and async errors
    return Bluebird.try(() => xhr);
}

// log(projectId, 'adi-bucket-item-replace', { from: CATALOGUE, to, dragged });

export { log };
// (C) 2007-2018 GoodData Corporation
import set = require('lodash/set');
import { SDK, factory as createSdk } from '@gooddata/gooddata-js';

const gdcCache = {};

export const FEATURE_FLAGS = 'featureFlags';
export const COLOR_PALETTE = 'colorPalette';

async function isColorPaletteEnabled(cache: any, projectId: string, sdk: SDK) {
    let featureFlags;

    // tslint:disable-next-line:prefer-conditional-expression
    if (cache[projectId] && cache[projectId][FEATURE_FLAGS]) {
        featureFlags = await cache[projectId][FEATURE_FLAGS];
    } else {
        featureFlags = await sdk.project.getFeatureFlags(projectId);
    }
    return featureFlags.isColorPaletteEnabled;
}

function isContentInCache(cache: any, projectId: string, contentType: string) {
    return cache[projectId] && cache[projectId][contentType];
}

export async function getCachedData(projectId: string, contentType: string, sdk: SDK = createSdk()) {
    if (isContentInCache(gdcCache, projectId, contentType)) {
        return gdcCache[projectId][contentType];
    }

    if (contentType === FEATURE_FLAGS) {
        const promise = sdk.project.getFeatureFlags(projectId);
        set(gdcCache, `${projectId}.${FEATURE_FLAGS}`, promise);
        return gdcCache[projectId][contentType];
    }

    if (contentType === COLOR_PALETTE) {
        const isEnabled = await isColorPaletteEnabled(gdcCache, projectId, sdk);
        if (isEnabled && !(isContentInCache(gdcCache, projectId, COLOR_PALETTE))) {
            const promise = sdk.project.getColorPaletteWithGuids(projectId);
            set(gdcCache, `${projectId}.${COLOR_PALETTE}`, promise);
        }
    }

    return gdcCache[projectId][contentType];
}

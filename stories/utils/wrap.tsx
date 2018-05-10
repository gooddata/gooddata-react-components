// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { IntlWrapper } from '../../src/components/core/base/IntlWrapper';

export function wrap(
    component: any,
    height: number | string = 600,
    width: number | string = 600,
    minHeight?: number,
    minWidth?: number,
    key?: any
) {
    const keyProp: any = key ? { key } : {};
    return (
        <IntlWrapper {...keyProp}>
            <div style={{ height, width, minHeight, minWidth, border: '1px solid pink' }}>
                {component}
            </div>
        </IntlWrapper>
    );
}

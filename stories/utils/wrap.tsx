import * as React from 'react';

const GEMINI_SCREENSHOT_CLASS = 'gemini-screenshot';

export function screenshotWrap(component: any) {
    return (
        <div className={GEMINI_SCREENSHOT_CLASS}>{component}</div>
    );
}

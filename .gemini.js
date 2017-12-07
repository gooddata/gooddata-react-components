module.exports = {
    windowSize: '1024x768',

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    },

    compositeImage: true,

    system: {
        plugins: {
            'html-reporter': {
                enabled: true,
                path: './gemini/reports'
            }
        }
    }
};

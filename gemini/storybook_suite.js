const glob = require('glob');
const utils = require('../.storybook/storybook_utils');

const files = glob.sync('./stories/**/*.tsx');
const stories = utils.getStories(files);

stories.forEach((item) => {
    gemini.suite(item.name, (suite) => { // eslint-disable-line no-undef
        suite.setUrl(item.url)
            .setCaptureElements('.gemini-screenshot')
            .capture('test', null, (actions) => {
                actions.wait(1000); // wait for hw rendering to be finished
            });
    });
});

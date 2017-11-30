const fs = require('fs');
const acornJsx = require('acorn-jsx/inject');
const acornSpread = require('acorn-object-spread/inject');
const acornBase = require('acorn');
const flatten = require('lodash/flatten');

const acorn = acornSpread(acornJsx(acornBase));

function getTokens(data) {
    try {
        // tokenizer() returns object so we need to convert it to array
        return [...acorn.tokenizer(data, {
            plugins: {
                jsx: true,
                objectSpread: true
            }
        })];
    } catch (e) {
        console.error(e); // eslint-disable-line no-console
        return process.exit(1);
    }
}

function isKind(tokens, token, i) {
    return token.value === 'storiesOf' && tokens[i + 1].type.label === '(';
}

function isStory(tokens, token, i) {
    return token.value === 'add' && tokens[i - 1].type.label === '.' && tokens[i + 1].type.label === '(';
}

function parseKinds(data) {
    let currentKind = null;

    const tokens = getTokens(data);
    const kinds = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (isKind(tokens, token, i)) {
            currentKind = tokens[i + 2].value;
            kinds.push({
                kind: currentKind,
                stories: []
            });
            i += 2;
        }

        if (isStory(tokens, token, i)) {
            const story = tokens[i + 2].value;
            kinds[kinds.length - 1].stories.push(story);
            i += 2;
        }
    }

    return kinds;
}

function mapKindToStoryUris(kind) {
    return kind.stories.map((story) => {
        return {
            url: `iframe.html?selectedKind=${encodeURIComponent(kind.kind)}&selectedStory=${encodeURIComponent(story)}`,
            name: `${kind.kind} - ${story}`
        };
    });
}

function getStories(filenames) {
    const kinds = flatten(
        filenames
            .map((filename) => {
                const data = fs.readFileSync(filename, 'utf8');
                return parseKinds(data);
            })
            .filter(k => k.length > 0)
    );

    return flatten(
        kinds.map(mapKindToStoryUris)
    );
}

module.exports = {
    getStories,
    parseKinds
};

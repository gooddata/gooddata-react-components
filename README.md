[![npm version](https://badge.fury.io/js/%40gooddata%2Freact-components.svg)](https://www.npmjs.com/package/@gooddata/react-components)

# GoodData.UI React components
> A React-based JavaScript library for building data-driven applications

## Getting started
- [GoodData.UI Documentation](http://sdk.gooddata.com/gooddata-ui/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/gooddata)

### Usage
With [yarn](https://yarnpkg.com) installed, go to your project directory and run
```
$ yarn add @gooddata/react-components
```
If you prefer [npm](npmjs.com) run
```
$ npm install --save @gooddata/react-components
```

The public API is exposed via global `index.js`. Except for the styles, do not import any other file directly
because they are not intended to be part of the public API.

## Contributing

We welcome any contribution in form of [issues](https://github.com/gooddata/gooddata-react-components/issues) or [pull requests](https://github.com/gooddata/gooddata-react-components/pulls).

Install [Node.js](http://nodejs.org) and [Yarn](https://classic.yarnpkg.com) (for versions, see `docker/.config`).

Install dependencies:
```
yarn install --frozen-lockfile
```

These commands may come in handy while developing:

| command | description |
| ------- | ----------- |
| `yarn install --pure-lockfile` | first step |
| ||
| `yarn dev` | build react-components to `/dist` in watch mode |
| `yarn test` | run all unit tests |
| `yarn prettier-write` | format the source code to match the valid codestyle |
| `yarn validate` | validate codestyle |
| ||
| `yarn storybook` | run storybook from `/stories` on http://localhost:9001 |
| `yarn build-storybook` | build storybook to `/dist-storybook` |
| `yarn test-storybook` | run storybook and [screenshot tests](https://github.com/gooddata/gdc-client-utils/tree/master/test-storybook) |
| ||
| `yarn examples` | run Live Examples dev-server from `/examples` on https://localhost:8999 |
| `yarn examples-build` | build Live Examples to `/examples/dist` |
| `yarn examples-server` | serve built Live Examples - see `/examples/server/src` |
| `yarn examples-testcafe` | run testcafe tests against `localhost:8999` |

### Enable Geo Chart for Storybook and Live Examples
Geo chart uses Mapbox to render map which requires a Mapbox access token.
- Register an account and create Mapbox access token at [guide](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/)
- Store the created token at `.env`:
```bash
echo -e "EXAMPLE_MAPBOX_ACCESS_TOKEN=token" >> .env # only need to run once
echo -e "STORYBOOK_MAPBOX_ACCESS_TOKEN=token" >> .env # only need to run once
```

### Run Live Examples Locally
To run *GoodData.UI Live Examples* locally:
```bash
git clone <this-repository>
cd  <repository-folder>
yarn install --pure-lockfile
yarn examples
```
Then open https://localhost:8999

### Run testcafe against locally running examples
Make sure the examples are running locally (previous step)
```bash
yarn examples-testcafe
```

### Run Storybook locally
- Run storybook with token stored in `.env` for more secure
```bash
yarn storybook
```
- Or run storybook with token env param exposed to cli (not suggested)
```bash
STORYBOOK_MAPBOX_ACCESS_TOKEN=token yarn storybook
```
- Apply either above way to `yarn build-storybook` or `yarn test-storybook`

### Source code formatting
The source code in the repository is formatted by [Prettier](https://prettier.io/).
The format of the code is validated by our Continuous Integration server and is one of the requirements of successful merge.

Prettier is supported by every major IDE. You can find the list of supported editors and how to configure them [here](https://prettier.io/docs/en/editors.html).

In the case, when your editor is not supported or you don't want to setup the integration, you can run the `yarn prettier-write` command to reformat the code before commit.

## Changelog

- see [CHANGELOG.md](CHANGELOG.md)

## Supported versions

We encourage you to always use the latest available version of GoodData.UI to make the user experience with integrating GoodData.UI as smooth and secure as possible and to ensure that GoodData.UI always uses the latest features of the GoodData platform.

For more information, see [Supported Versions](https://sdk.gooddata.com/gooddata-ui/docs/supported_versions.html).

Please follow the installation instructions in the [gooddata-ui-sdk repository](https://github.com/gooddata/gooddata-ui-sdk) to update to the latest version.

## License

(C) 2007-2020 GoodData Corporation

This project is dual licensed:

- The ATTRIBUTION-NONCOMMERCIAL 4.0 INTERNATIONAL (CC BY-NC 4.0) is used for purpose of the trial experience and evaluation of GoodData.UI library.
- The GOODDATA GOODDATA.UI LIBRARY END USER LICENSE AGREEMENT is used for GoodData customers.

For more information, please see [LICENSE](https://github.com/gooddata/gooddata-react-components/blob/master/LICENSE).

# GoodData React Components
> React.js components for building visualizations on top of GoodData platform

## Getting started
- [Documentation](http://sdk.gooddata.com/gdc-ui-sdk-doc/)


### Usage
With [yarn](https://yarnpkg.com) installed, go to your project directory and run
```
$ yarn add @gooddata/react-components
```
If you prefer [npm](npmjs.com) run
```
$ npm install --save @gooddata/react-components
```

## Develop
### Running the development
To develop, you need to run the typescript compiler. By running `yarn dev`, the typescript compiler will be run in watch mode.
```sh
$ cd gooddata-react-components
$ yarn dev
```

If you just need to build the CSS files from SASS, run
```sh
$ yarn build-css
```

To see and validate the react components, you can use [Storybook](https://storybook.js.org/).
To run the storybook in development mode, run
```sh
$ yarn storybook
```

To deploy the production version of storybook, run
```sh
$ yarn build-storybook
```

### Running the tests
To validate using [tslint](https://palantir.github.io/tslint/), run
```sh
$ yarn validate
```

#### Storybook visual regression tests
Visual regression testing for Storybook is provided by [@gooddata/test-storybook](https://github.com/gooddata/gdc-client-utils/tree/master/test-storybook) package.



### Examples
A showcase of what is possible to do with [@gooddata/react-components](https://github.com/gooddata/gooddata-react-components).
```
yarn examples
```

## Contributing
Report bugs and features on our [issues page](https://github.com/gooddata/gooddata-react-components/issues).

#### GD-internal-notes - deployment
```
git checkout master && git pull upstream master --tags
yarn version
npm publish
git push upstream master --tags
```

## Changelog
- see [CHANGELOG.md](CHANGELOG.md)

## License
(C) 2007-2018 GoodData Corporation

For more information, please see [LICENSE](https://github.com/gooddata/gooddata-react-components/blob/master/LICENSE)

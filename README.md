# gdc-data-layer

## Install:
```sh
yarn install
```

## Setup:

```sh
echo "We don't know yet, olol"
```

## Running test suite:
```sh
yarn test
```

##Usage
 - [DataTable](https://confluence.intgdc.com/display/VS/Obtain+Data+from+the+GoodData+Platform)
 - [AFM](https://confluence.intgdc.com/display/VS/AFM)
 - [Transformation](https://confluence.intgdc.com/display/VS/Transformation)

## Releasing
```
git checkout master && git pull upstream master --tags
npm version patch -m "Release v%s"
npm publish --access=restricted
git push upstream master --tags
```

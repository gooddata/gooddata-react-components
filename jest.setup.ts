// (C) 2019 GoodData Corporation
import { configure } from "enzyme";
import * as EnzymeAdapter from "enzyme-adapter-react-16";
import "jest-enzyme";
import * as requestAnimationFrame from "raf";
import "@formatjs/intl-pluralrules";
import "@formatjs/intl-pluralrules/polyfill-locales";

requestAnimationFrame.polyfill();
configure({ adapter: new EnzymeAdapter() });

// from https://github.com/mapbox/mapbox-gl-js/issues/3436
jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
    GeolocateControl: jest.fn(),
    Map: jest.fn(() => ({
        addControl: jest.fn(),
        on: jest.fn(),
        remove: jest.fn(),
    })),
    NavigationControl: jest.fn(),
}));

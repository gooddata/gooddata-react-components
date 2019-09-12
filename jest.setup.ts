// (C) 2019 GoodData Corporation
import { configure } from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import * as raf from 'raf';

raf.polyfill();
configure({ adapter: new EnzymeAdapter() });

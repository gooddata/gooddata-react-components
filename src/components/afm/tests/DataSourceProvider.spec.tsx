// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { mount } from 'enzyme';
import { AFM } from '@gooddata/typings';
import {
    dataSourceProvider,
    IDataSourceProviderProps,
    IDataSourceProviderInjectedProps
} from '../DataSourceProvider';
import { Table } from '../../tests/mocks';
import { delay } from '../../tests/utils';

describe('DataSourceProvider', () => {
    const defaultProps = {
        afm: {},
        projectId: 'projid',
        resultSpec: {}
    };

    function generateDefaultDimensions(): AFM.IDimension[] {
        return [];
    }
    function createComponent(
        component: any,
        props: IDataSourceProviderProps = defaultProps
    ) {
        const WrappedComponent = dataSourceProvider(component, generateDefaultDimensions, 'DummyNameInMocks');

        return mount(
            <WrappedComponent {...props} />
        );
    }

    it('should prepare datasource', () => {
        const wrapper = createComponent(Table);

        return delay().then(() => {
            wrapper.update();
            const table = wrapper.find(Table);
            expect(table.length).toEqual(1);

            const tableProps = table.props() as IDataSourceProviderInjectedProps;
            expect(tableProps.dataSource).toBeDefined();
        });
    });

    it('should recreate dataSource when projects differ', () => {
        const wrapper = createComponent(Table);
        const newProps: IDataSourceProviderProps = {
            afm: {},
            projectId: 'projid2',
            resultSpec: {}
        };
        return delay().then(() => {
            wrapper.update();
            const table = wrapper.find(Table);
            const tableProps: IDataSourceProviderInjectedProps = table.props();
            const oldDataSource = tableProps.dataSource;
            wrapper.setProps(newProps);
            return delay().then(() => {
                wrapper.update();
                const table = wrapper.find(Table);
                const tableProps = table.props() as IDataSourceProviderInjectedProps;
                expect(table.length).toEqual(1);
                expect(tableProps.dataSource).not.toBe(oldDataSource);
            });
        });
    });

    it('should recreate datasource when afm changes', () => {
        const wrapper = createComponent(Table);

        const newProps: IDataSourceProviderProps = {
            afm: { measures: [], attributes: [] },
            projectId: 'projid',
            resultSpec: {}
        };

        return delay().then(() => {
            wrapper.update();
            const table = wrapper.find(Table);
            const tableProps: IDataSourceProviderInjectedProps = table.props();
            const oldDataSource = tableProps.dataSource;
            wrapper.setProps(newProps);
            return delay().then(() => {
                wrapper.update();
                const table = wrapper.find(Table);
                const tableProps: IDataSourceProviderInjectedProps = table.props();
                expect(table.length).toEqual(1);
                expect(tableProps.dataSource).not.toBe(oldDataSource);
            });
        });
    });

    it('should recreate dataSource only once when all props change', () => {
        const wrapper = createComponent(Table);

        const newProps: IDataSourceProviderProps = {
            afm: {
                measures: [],
                attributes: []
            },
            projectId: 'projid2',
            resultSpec: {
                sorts: [
                    {
                        attributeSortItem: {
                            attributeIdentifier: 'a1',
                            direction: 'desc'
                        }
                    }
                ]
            }
        };

        return delay().then(() => {
            wrapper.update();
            const instance: any = wrapper.instance();
            const prepareDataSourceSpy = jest.spyOn(instance, 'prepareDataSource');
            wrapper.setProps(newProps);
            return delay().then(() => {
                wrapper.update();
                expect(prepareDataSourceSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    it('should not render component if dataSource is missing', () => {
        const wrapper = createComponent(Table);

        return delay().then(() => {
            wrapper.update();
            wrapper.setState({ dataSource: null });
            return delay().then(() => {
                wrapper.update();
                expect(wrapper.find(Table).length).toEqual(0);
            });
        });
    });

    it('should provide modified resultSpec to InnerComponent', () => {
        const defaultDimension = () => [{ itemIdentifiers: ['x'] }];
        const WrappedTable = dataSourceProvider(Table, defaultDimension, 'DummyNameInMocks');
        const wrapper = mount(<WrappedTable {...defaultProps} />);

        return delay().then(() => {
            wrapper.update();
            expect(wrapper.find(Table).props().resultSpec.dimensions).toEqual(defaultDimension());
        });
    });

    it('should use componentName in telemetry', () => {
        const sdk: any = {
            clone: jest.fn(() => sdk),
            config: {
                setJsPackage: jest.fn(),
                setRequestHeader: jest.fn()
            }
        };
        const defaultProps = {
            afm: {},
            projectId: 'projid',
            resultSpec: {},
            sdk
        };
        const defaultDimension = () => [{ itemIdentifiers: ['x'] }];
        const WrappedTable = dataSourceProvider(Table, defaultDimension, 'DummyNameInMocks');
        mount(<WrappedTable {...defaultProps} />);

        expect(sdk.clone).toHaveBeenCalledTimes(2);
        expect(sdk.config.setJsPackage.mock.calls[0][0]).toEqual('@gooddata/react-components');
        expect(sdk.config.setJsPackage.mock.calls[1][0]).toEqual('@gooddata/data-layer');
        expect(sdk.config.setRequestHeader.mock.calls[0]).toEqual(['X-GDC-JS-SDK-COMP', 'DummyNameInMocks']);
        expect(sdk.config.setRequestHeader.mock.calls[1])
            .toEqual(['X-GDC-JS-SDK-COMP-PROPS', 'afm,projectId,resultSpec,sdk']);
    });

    it('should use gooddata-js sdk from context if provided', () => {
        const sdk: any = {
            clone: jest.fn(() => sdk),
            config: {
                setJsPackage: jest.fn(),
                setRequestHeader: jest.fn()
            }
        };

        const defaultProps = {
            afm: {},
            projectId: 'projid',
            resultSpec: {}
        };

        const defaultDimension = () => [{ itemIdentifiers: ['x'] }];
        const WrappedTable = dataSourceProvider(Table, defaultDimension, 'DummyNameInMocks');
        mount(<WrappedTable {...defaultProps} />, { context: { gooddata: sdk } });

        expect(sdk.clone).toHaveBeenCalled();
    });
});

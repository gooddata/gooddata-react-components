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
        const WrappedComponent = dataSourceProvider(component, generateDefaultDimensions);

        return mount(
            <WrappedComponent {...props} />
        );
    }

    it('should prepare datasource', () => {
        const wrapper = createComponent(Table);

        return delay().then(() => {
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
            const table = wrapper.find(Table);
            const tableProps: IDataSourceProviderInjectedProps = table.props();
            const oldDataSource = tableProps.dataSource;
            wrapper.setProps(newProps);
            return delay().then(() => {
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
            const table = wrapper.find(Table);
            const tableProps: IDataSourceProviderInjectedProps = table.props();
            const oldDataSource = tableProps.dataSource;
            wrapper.setProps(newProps);
            return delay().then(() => {
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
            const node: any = wrapper.getNode();
            const prepareDataSourceSpy = jest.spyOn(node, 'prepareDataSource');
            wrapper.setProps(newProps);
            return delay().then(() => {
                expect(prepareDataSourceSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    it('should not render component if dataSource is missing', () => {
        const wrapper = createComponent(Table);

        return delay().then(() => {
            wrapper.setState({ dataSource: null });
            return delay().then(() => {
                expect(wrapper.find(Table).length).toEqual(0);
            });
        });
    });
});

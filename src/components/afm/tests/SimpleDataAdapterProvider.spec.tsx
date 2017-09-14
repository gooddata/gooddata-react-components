import * as React from 'react';
import { mount } from 'enzyme';
import {
    simpleDataAdapterProvider,
    ISimpleDataAdapterProviderProps,
    VisType,
    ISimpleDataAdapterProviderInjectedProps
} from '../SimpleDataAdapterProvider';
import { Table } from '../../tests/mocks';

import { test } from '@gooddata/js-utils';
import { VisualizationTypes } from '../../../constants/visualizationTypes';

const { postpone } = test;

describe('SimpleDataAdapterProvider', () => {
    const defaultProps = {
        afm: {},
        projectId: 'projid',
        transformation: {}
    };

    function createComponent(
        component: any,
        type: VisType,
        props: ISimpleDataAdapterProviderProps = defaultProps
    ) {
        const WrappedComponent = simpleDataAdapterProvider(component, type);

        return mount(
            <WrappedComponent {...props} />
        );
    }

    it('should prepare datasource and metadataSource', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);

        postpone(
            () => {
                const table = wrapper.find(Table);
                expect(table.length).toEqual(1);

                const tableProps = table.props() as ISimpleDataAdapterProviderInjectedProps;
                expect(tableProps.dataSource).toBeDefined();
                expect(tableProps.metadataSource).toBeDefined();
            },
            done()
        );
    });

    it('should recreate DS and MDS when projects differ', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);

        const newProps: ISimpleDataAdapterProviderProps = {
            afm: {},
            projectId: 'projid2',
            transformation: {}
        };

        postpone(
            () => {
                const table = wrapper.find(Table);
                const tableProps = table.props() as ISimpleDataAdapterProviderInjectedProps;
                const oldDs = tableProps.dataSource;
                const oldMds = tableProps.metadataSource;
                wrapper.setProps(newProps, () => {
                    postpone(
                        () => {
                            expect(table.length).toEqual(1);
                            expect(tableProps.dataSource).not.toBe(oldDs);
                            expect(tableProps.metadataSource).not.toBe(oldMds);

                        },
                        done()
                    );
                });
            },
            done()
        );
    });

    it('should recreate DS and MDS when afm changes', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);

        const newProps: ISimpleDataAdapterProviderProps = {
            afm: { measures: [], attributes: [] },
            projectId: 'projid',
            transformation: {}
        };

        postpone(
            () => {
                const table = wrapper.find(Table);
                const tableProps = table.props() as ISimpleDataAdapterProviderInjectedProps;
                const oldDs = tableProps.dataSource;
                const oldMds = tableProps.metadataSource;
                wrapper.setProps(newProps, () => {
                    postpone(
                        () => {
                            expect(table.length).toEqual(1);
                            expect(tableProps.dataSource).not.toBe(oldDs);
                            expect(tableProps.metadataSource).not.toBe(oldMds);
                        },
                        done()
                    );
                });
            },
            done()
        );
    });

    it('should recreate MDS when transformation changes', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);

        const newProps: ISimpleDataAdapterProviderProps = {
            afm: {},
            projectId: 'projid',
            transformation: {
                sorting: [
                    {
                        column: 'a',
                        direction: 'b'
                    }
                ]
            }
        };

        postpone(
            () => {
                const table = wrapper.find(Table);
                const tableProps = table.props() as ISimpleDataAdapterProviderInjectedProps;
                const oldDs = tableProps.dataSource;
                const oldMds = tableProps.metadataSource;
                wrapper.setProps(newProps, () => {
                    postpone(
                        () => {
                            expect(table.length).toEqual(1);
                            expect(tableProps.dataSource).toBe(oldDs);
                            expect(tableProps.metadataSource).not.toBe(oldMds);
                        },
                        done()
                    );
                });
            },
            done()
        );
    });

    it('should recreate DS and MDS only once when all props change', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);

        const newProps: ISimpleDataAdapterProviderProps = {
            afm: {
                measures: [],
                attributes: []
            },
            projectId: 'projid2',
            transformation: {
                sorting: [
                    {
                        column: 'a',
                        direction: 'b'
                    }
                ]
            }
        };

        postpone(
            () => {
                const node: any = wrapper.getNode();
                const prepareDataSourceSpy = jest.spyOn(node, 'prepareDataSource');
                const prepareMDSourceSpy = jest.spyOn(node, 'prepareMDSource');
                wrapper.setProps(newProps, () => {
                    postpone(
                        () => {
                            expect(prepareDataSourceSpy).toHaveBeenCalledTimes(1);
                            expect(prepareMDSourceSpy).toHaveBeenCalledTimes(1);
                        },
                        done()
                    );
                });
            },
            done()
        );
    });

    it('should not render component if DS is missing', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);

        postpone(
            () => {
                wrapper.setState({ dataSource: null }, () => {
                    postpone(
                        () => {
                            expect(wrapper.find(Table).length).toEqual(0);
                        },
                        done()
                    );
                });
            },
            done()
        );
    });

    it('should not render component if MDS is missing', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);

        postpone(
            () => {
                wrapper.setState({ metadataSource: null }, () => {
                    postpone(
                        () => {
                            expect(wrapper.find(Table).length).toEqual(0);
                        },
                        done()
                    );
                });
            },
            done
        );
    });

    it('should cancel promise when unmounting', (done) => {
        const wrapper = createComponent(Table, VisualizationTypes.TABLE);
        const cancelDS = jest.fn();
        const cancelMDS = jest.fn();

        const node: any = wrapper.getNode();
        node.prepareDataSourceCancellable = { cancel: cancelDS };
        node.prepareMetadataSourceCancellable = { cancel: cancelMDS };

        postpone(
            () => {
                wrapper.unmount();
                expect(cancelDS).toHaveBeenCalled();
                expect(cancelMDS).toHaveBeenCalled();
            },
            done()
        );
    });
});

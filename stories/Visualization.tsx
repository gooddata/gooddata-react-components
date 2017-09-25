import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Afm } from '@gooddata/data-layer';

import { Visualization, IVisualizationProps } from '../src/components/uri/Visualization';

import '../styles/scss/charts.scss';
import '../styles/scss/table.scss';
import { onErrorHandler } from './mocks';

const defaultFilter: Afm.IFilter = {
    id: '/gdc/md/myproject/obj/123',
    type: 'date',
    intervalType: 'absolute',
    granularity: 'date',
    between: ['2017-01-01', '2017-12-31']
};

class DynamicVisualization extends React.Component<any, any> {
    initialProps: IVisualizationProps = {
        projectId: 'myproject',
        uri: '/gdc/md/myproject/obj/1002',
        config: {
            colors: [
                'rgba(195, 49, 73, 1)',
                'rgba(168, 194, 86, 1)',
                'rgba(243, 217, 177, 1)',
                'rgba(194, 153, 121, 1)',
                'rgba(162, 37, 34, 1)'
            ],
            legend: {
                position: 'top'
            }
        },
        filters: [defaultFilter],
        width: null,
        height: null,
        minHeight: 600
    };

    alternativeProps: IVisualizationProps = {
        projectId: 'myproject',
        uri: '/gdc/md/myproject/obj/1001',
        config: {
            legend: {
                position: 'left'
            }
        },
        filters: [],
        height: 800,
        width: 400,
        minHeight: null
    };

    onLoadingChanged = ({ isLoading }) => {
        this.setState({ isLoading });
    }

    constructor(nextProps) {
        super(nextProps);
        this.state = this.initialProps;
    }

    toggle(prop) {
        this.setState({
            [prop]: this.state[prop] === this.initialProps[prop] ?
            this.alternativeProps[prop] :
            this.initialProps[prop]
        });
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={this.toggle.bind(this, 'uri')} >toggle uri</button>
                    <button onClick={this.toggle.bind(this, 'filters')} >toggle filter</button>
                    <button onClick={this.toggle.bind(this, 'config')} >toggle config</button>
                    <button onClick={this.toggle.bind(this, 'width')} >toggle width</button>
                    <button onClick={this.toggle.bind(this, 'height')} >toggle height</button>
                    <button onClick={this.toggle.bind(this, 'minHeight')} >toggle minHeight</button>
                </div>
                <Visualization
                    key="dynamic-test-vis"
                    onLoadingChanged={this.onLoadingChanged}
                    onError={onErrorHandler}
                    {...this.state}
                />
                { this.state.isLoading ? <div style={{
                    minHeight: 200,
                    height: '100%'
                }}><div className="gd-spinner large" style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    margin: '-16px 0 0 -16px'
                }} ></div></div> : null }
            </div>
        );
    }
}

const visStories = storiesOf('Visualization', module)
    .add('table example', () => (
        <div style={{ width: 800, height: 400 }}>
            <Visualization
                projectId="myproject"
                uri={'/gdc/md/myproject/obj/1001'}
                onError={onErrorHandler}
            />
        </div>
    ))
    .add('table example with identifier', () => (
        <div style={{ width: 800, height: 400 }}>
            <Visualization
                projectId="myproject"
                identifier="1001"
                onError={onErrorHandler}
            />
        </div>
    ))
    .add('chart example', () => (
        <div style={{ width: 800, height: 400 }}>
            <Visualization
                projectId="myproject"
                uri={'/gdc/md/myproject/obj/1002'}
                onError={onErrorHandler}
            />
        </div>
    ))
    .add('chart with custom colors example', () => (
        <div style={{ width: 800, height: 400 }}>
            <Visualization
                projectId="myproject"
                uri={'/gdc/md/myproject/obj/1002'}
                config={{
                    colors: [
                        'rgba(195, 49, 73, 1)',
                        'rgba(168, 194, 86, 1)',
                        'rgba(243, 217, 177, 1)',
                        'rgba(194, 153, 121, 1)',
                        'rgba(162, 37, 34, 1)'
                    ]
                }}
                onError={onErrorHandler}
            />
        </div>
    ))
    .add('chart with applied filter', () => {
        const filter: Afm.IFilter = {
            id: '/gdc/md/myproject/obj/123',
            type: 'date',
            intervalType: 'absolute',
            granularity: 'date',
            between: ['2017-01-01', '2017-12-31']
        };
        return (
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="myproject"
                    uri={'/gdc/md/myproject/obj/1002'}
                    filters={[filter]}
                    onError={onErrorHandler}
                />
            </div>
        );
    });

// Add a combination of legend positions and size configurations use cases
const legendPositions = ['top', 'right', 'bottom', 'left'];
const sizeConfigurations = [
    { label: 'default sizing (minHeight 400px)', props: {} },
    { label: 'minHeight 600', props: { minHeight: 600 } },
    { label: 'height 200', props: { height: 200 } },
    { label: 'width 400', props: { width: 400  } }
];
legendPositions.reduce((visConfigs, position) => {
    return visConfigs.concat(sizeConfigurations.map(({ label, props }) => {
        return {
            label: 'Legend ' + position + ' ' + label,
            props: {
                projectId: 'myproject',
                uri: '/gdc/md/myproject/obj/1002',
                ...props,
                config: { legend: { position } }
            }
        };
    }, []));
}, []).map(({ label, props }) => (
    visStories.add(label, () => (
        <Visualization {...props} key="legend-size-use-case" />
    ))
));

visStories.add('visualization fitting parent height', () => {
    const props = {
        projectId: 'myproject',
        uri: '/gdc/md/myproject/obj/1002'
    };
    return <div style={{ position: 'relative', height: 800 }}>
        <Visualization {...props} />
    </div>;
});


visStories.add('dynamic visualization test', () => (
    <div style={{ position: 'relative' }}>
        <DynamicVisualization />
    </div>
));

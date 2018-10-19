// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { SDK, factory as createSdk } from '@gooddata/gooddata-js';
import { IColorPaletteItem, IColorPalette } from '../components/visualizations/chart/Chart';

declare module 'react' {
    type Provider<T> = React.ComponentType<{
      value: T;
      children?: React.ReactNode;
    }>;
    type Consumer<T> = React.ComponentType<{
      children: (value: T) => React.ReactNode;
      unstable_observedBits?: number;
    }>;

    interface IContext<T> {
      Provider: Provider<T>;
      Consumer: Consumer<T>;
    }
    function createContext<T>(defaultValue: T, calculateChangedBits?: (prev: T, next: T) => number): IContext<T>;
}

export interface IGdcWrapperProps {
    sdk?: SDK;
    projectId?: string;
}

export interface IGdcWrapperState {
    colorPalette: IColorPaletteItem[];
    colorPaletteEnabled: boolean;
}

export const GdcContext = React.createContext(
    { colorPalette: null }
);

export default class GdcWrapper extends React.PureComponent<IGdcWrapperProps, IGdcWrapperState> {
    private sdk: SDK;

    constructor(props: IGdcWrapperProps) {
        super(props);
        const sdk = props.sdk || createSdk();

        this.sdk = sdk.clone();

        this.state = {
            colorPalette: null,
            colorPaletteEnabled: false
        };
    }

    public async componentDidMount() {
        const featureFlags = await this.sdk.project.getFeatureFlags(this.props.projectId);
        this.setState({ colorPaletteEnabled: Boolean(featureFlags.enableColorPalette) }, this.getColorPalette);
    }

    public render() {
        const colorPalette: IColorPalette = this.state.colorPalette;
        return (
            <GdcContext.Provider value={{ colorPalette }}>
                {this.props.children}
            </GdcContext.Provider>
        );
    }

    private async getColorPalette() {
        if (this.state.colorPaletteEnabled) {
            const colorPalette = await this.sdk.project.getColorPaletteWithGuids(this.props.projectId);
            if (colorPalette) {
                this.setState({ colorPalette });
            }
        }
    }
}

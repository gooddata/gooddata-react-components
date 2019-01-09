// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import {
    getViewportDimensionsAndCoords,
    getElementDimensions,
    getElementDimensionsAndCoords,
    calculateMenuPosition
} from './positioningCalculations';
import { IMenuPositionConfig } from '../MenuSharedTypes';

export interface IPositionedMenuContentProps extends IMenuPositionConfig {
    topLevelMenu: boolean;
    togglerEl: HTMLElement;
    children: React.ReactNode;
}

export interface IPositionedMenuContentState {
    left: number;
    top: number;
}

export default class PositionedMenuContent extends React.Component<
    IPositionedMenuContentProps,
    IPositionedMenuContentState
> {
    public state: IPositionedMenuContentState = {
        left: 0,
        top: 0
    };

    private menuEl: HTMLElement = null;

    public componentDidUpdate(prevProps: IPositionedMenuContentProps) {
        if (
            prevProps.alignment !== this.props.alignment ||
            prevProps.spacing !== this.props.spacing ||
            prevProps.offset !== this.props.offset ||
            prevProps.topLevelMenu !== this.props.topLevelMenu ||
            prevProps.togglerEl !== this.props.togglerEl ||
            prevProps.children !== this.props.children
        ) {
            this.positionMenu();
        }
    }

    public componentDidMount() {
        this.positionMenu();
        window.addEventListener('resize', this.positionMenu);
        window.addEventListener('scroll', this.positionMenu);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.positionMenu);
        window.removeEventListener('scroll', this.positionMenu);
    }

    public render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    left: this.state.left,
                    top: this.state.top
                }}
                ref={this.setElMenu}
            >
                {this.props.children}
            </div>
        );
    }

    private setElMenu = (el: HTMLElement) => {
        this.menuEl = el;
    }

    private positionMenu = () => {
        if (!this.props.togglerEl || !this.menuEl) {
            return;
        }

        const { left, top } = calculateMenuPosition({
            toggler: getElementDimensionsAndCoords(this.props.togglerEl),
            menu: getElementDimensions(this.menuEl),
            viewport: getViewportDimensionsAndCoords(),
            alignment: this.props.alignment,
            spacing: this.props.spacing,
            offset: this.props.offset,
            topLevelMenu: this.props.topLevelMenu
        });

        this.setState({ left, top });
    }
}

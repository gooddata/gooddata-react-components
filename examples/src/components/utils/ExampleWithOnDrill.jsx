// (C) 2019 GoodData Corporation
import React, { Component } from "react";

export class ExampleWithOnDrill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drillEvent: null,
        };
    }

    onDrill = drillEvent => this.setState({ drillEvent });

    renderDrillEvent = () => <pre className="s-output">{JSON.stringify(this.state.drillEvent, null, 4)}</pre>;
}

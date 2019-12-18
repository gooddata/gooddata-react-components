// (C) 2007-2020 GoodData Corporation
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { PivotTable, Model, MeasureValueFilterDropdown } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import { projectId, franchisedSalesIdentifier, locationNameDisplayFormIdentifier } from "../utils/fixtures";

const franchisedSalesMeasure = Model.measure(franchisedSalesIdentifier)
    .localIdentifier("franchisedSales")
    .title("Franchised Sales in %")
    .ratio();
const measures = [franchisedSalesMeasure];

const attributes = [Model.attribute(locationNameDisplayFormIdentifier).localIdentifier("locationName")];

const DropdownButton = ({ isActive, measureTitle, onClick }) => {
    const className = classNames(
        "gd-mvf-dropdown-button",
        "s-mvf-dropdown-button",
        "gd-button",
        "gd-button-secondary",
        "button-dropdown",
        "icon-right",
        { "icon-navigateup": isActive, "icon-navigatedown": !isActive },
    );

    return (
        <button className={className} onClick={onClick}>
            {measureTitle}
        </button>
    );
};

DropdownButton.propTypes = {
    isActive: PropTypes.bool.isRequired,
    measureTitle: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export class MeasureValueFilterDropdownRatioExample extends React.PureComponent {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    state = {
        filters: [],
        displayDropdown: false,
    };

    onApply = filter => {
        this.setState({ filters: [filter], displayDropdown: false });
    };

    onCancel = () => {
        this.setState({ displayDropdown: false });
    };

    toggleDropdown = () => {
        this.setState(state => ({ ...state, displayDropdown: !state.displayDropdown }));
    };

    render() {
        const { filters, displayDropdown } = this.state;
        return (
            <React.Fragment>
                <div ref={this.ref}>
                    <DropdownButton
                        onClick={this.toggleDropdown}
                        isActive={displayDropdown}
                        measureTitle="Measure"
                    />
                </div>
                {displayDropdown ? (
                    <MeasureValueFilterDropdown
                        onApply={this.onApply}
                        onCancel={this.onCancel}
                        measureIdentifier={franchisedSalesMeasure.measure.localIdentifier}
                        filter={filters[0] || null}
                        anchorEl={this.ref.current}
                        warningMessage="The filter uses actual measure values, not percentage."
                    />
                ) : null}
                <hr className="separator" />
                <div style={{ height: 300 }} className="s-pivot-table">
                    <PivotTable
                        projectId={projectId}
                        measures={measures}
                        rows={attributes}
                        filters={filters}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default MeasureValueFilterDropdownRatioExample;

// (C) 2007-2019 GoodData Corporation
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { PivotTable, Model, MeasureValueFilterDropdown } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import {
    projectId,
    franchiseFeesIdentifier,
    franchisedSalesIdentifier,
    locationNameDisplayFormIdentifier,
} from "../utils/fixtures";

const franchiseFeesMeasure = Model.measure(franchiseFeesIdentifier)
    .format("#,##0")
    .localIdentifier("franchiseFees")
    .title("Franchise Fees");
const franchisedSalesMeasure = Model.measure(franchisedSalesIdentifier)
    .format("#,##0")
    .localIdentifier("franchisedSales")
    .title("Franchised Sales");
const measures = [franchiseFeesMeasure, franchisedSalesMeasure];

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

export class MeasureValueFilterDropdownExample extends React.PureComponent {
    state = {
        filters: [],
        displayDropdown: false,
    };

    onApply = filter => {
        this.setState({ filters: [filter], displayDropdown: false });
    };

    onCancel = () => {
        this.toggleButtonRef = null;
        this.setState({ displayDropdown: false });
    };

    toggleDropdown = e => {
        this.toggleButtonRef = !this.state.displayDropdown ? e.currentTarget : null;
        this.setState(state => ({ ...state, displayDropdown: !state.displayDropdown }));
    };

    render() {
        const { filters, displayDropdown } = this.state;
        return (
            <div>
                <DropdownButton
                    onClick={this.toggleDropdown}
                    isActive={displayDropdown}
                    measureTitle="Measure"
                />
                {displayDropdown ? (
                    <MeasureValueFilterDropdown
                        onApply={this.onApply}
                        onCancel={this.onCancel}
                        measureIdentifier={franchisedSalesMeasure.measure.localIdentifier}
                        filter={filters[0] || null}
                        anchorEl={this.toggleButtonRef}
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
            </div>
        );
    }
}

export default MeasureValueFilterDropdownExample;

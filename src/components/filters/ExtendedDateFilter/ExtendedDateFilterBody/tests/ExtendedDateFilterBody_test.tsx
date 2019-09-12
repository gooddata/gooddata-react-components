// (C) 2019 GoodData Corporation
import React from "react";
import { shallow } from "enzyme";
import { ExtendedDateFilters } from "@gooddata/typings";
import { ExtendedDateFilterBody, IExtendedDateFilterBodyProps } from "../ExtendedDateFilterBody";
import { ExcludeCurrentPeriodToggle } from "../../ExcludeCurrentPeriodToggle/ExcludeCurrentPeriodToggle";
import { EditModeMessage } from "../EditModeMessage";
import {
    DateFilterButtonLocalized,
    IDateFilterButtonLocalizedProps,
} from "../../DateFilterButtonLocalized/DateFilterButtonLocalized";

describe("ExtendedDateFilterBody", () => {
    const allTime: ExtendedDateFilters.IAllTimeDateFilter = {
        type: "allTime",
        localIdentifier: "ALL_TIME",
        name: "",
        visible: true,
    };

    const createDateFilterButton = (props?: IDateFilterButtonLocalizedProps) => {
        const defaultProps: IDateFilterButtonLocalizedProps = {
            isMobile: false,
            dateFilterOption: allTime,
            excludeCurrentPeriod: false,
        };
        return <DateFilterButtonLocalized {...defaultProps} {...props} />;
    };

    const mockProps: IExtendedDateFilterBodyProps = {
        filterOptions: {},
        dateFilterButton: createDateFilterButton(),
        selectedFilterOption: allTime,
        onSelectedFilterOptionChange: jest.fn(),

        excludeCurrentPeriod: false,
        isExcludeCurrentPeriodEnabled: false,
        onExcludeCurrentPeriodChange: jest.fn(),

        availableGranularities: [],
        isEditMode: false,
        isMobile: false,

        onApplyClick: jest.fn(),
        onCancelClick: jest.fn(),
        closeDropdown: jest.fn(),
    };

    it("should pass the isExcludeCurrentPeriodEnabled=true to Exclude button", () => {
        const rendered = shallow(
            <ExtendedDateFilterBody {...mockProps} isExcludeCurrentPeriodEnabled={true} />,
        );
        expect(rendered.find(ExcludeCurrentPeriodToggle)).not.toBeDisabled();
    });

    it("should pass the isExcludeCurrentPeriodEnabled=false to Exclude button", () => {
        const rendered = shallow(
            <ExtendedDateFilterBody {...mockProps} isExcludeCurrentPeriodEnabled={false} />,
        );
        expect(rendered.find(ExcludeCurrentPeriodToggle)).toBeDisabled();
    });

    it("should display edit mode message in edit mode", () => {
        const rendered = shallow(<ExtendedDateFilterBody {...mockProps} isEditMode={true} />);
        expect(rendered.find(EditModeMessage)).toExist();
    });

    it("should not display edit mode message in normal mode", () => {
        const rendered = shallow(<ExtendedDateFilterBody {...mockProps} isEditMode={false} />);
        expect(rendered.find(EditModeMessage)).not.toExist();
    });
});

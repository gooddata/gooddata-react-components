// (C) 2019 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import { ExtendedDateFilters } from "@gooddata/typings";
import { DateFilterBody, IDateFilterBodyProps } from "../DateFilterBody";
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
        };
        return <DateFilterButtonLocalized {...defaultProps} {...props} />;
    };

    const mockProps: IDateFilterBodyProps = {
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
        const rendered = shallow(<DateFilterBody {...mockProps} isExcludeCurrentPeriodEnabled={true} />);
        expect(rendered.find(ExcludeCurrentPeriodToggle)).not.toBeDisabled();
    });

    it("should pass the isExcludeCurrentPeriodEnabled=false to Exclude button", () => {
        const rendered = shallow(<DateFilterBody {...mockProps} isExcludeCurrentPeriodEnabled={false} />);
        expect(rendered.find(ExcludeCurrentPeriodToggle)).toBeDisabled();
    });

    it("should display edit mode message in edit mode", () => {
        const rendered = shallow(<DateFilterBody {...mockProps} isEditMode={true} />);
        expect(rendered.find(EditModeMessage)).toExist();
    });

    it("should not display edit mode message in normal mode", () => {
        const rendered = shallow(<DateFilterBody {...mockProps} isEditMode={false} />);
        expect(rendered.find(EditModeMessage)).not.toExist();
    });
});

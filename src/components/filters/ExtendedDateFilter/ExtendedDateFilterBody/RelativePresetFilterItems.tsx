// (C) 2019 GoodData Corporation
import * as React from "react";
import kebabCase from "lodash/kebabCase";
import cx from "classnames";
import { ExtendedDateFilters } from "@gooddata/typings";
import { ListItem } from "../ListItem/ListItem";
import { ListHeading } from "../ListHeading/ListHeading";
import { RelativePresetTitleTranslated } from "../RelativePresetTitleTranslated";
import { DateFilterTextLocalized } from "../DateFilterTextLocalized/DateFilterTextLocalized";

const granularityOrder: ExtendedDateFilters.DateFilterGranularity[] = [
    "GDC.time.date",
    "GDC.time.week_us",
    "GDC.time.month",
    "GDC.time.quarter",
    "GDC.time.year",
];

interface IRelativePresetFilterItemsProps {
    filterOption: ExtendedDateFilters.DateFilterRelativeOptionGroup;
    selectedFilterOption: ExtendedDateFilters.DateFilterOption;
    className?: string;
    onSelectedFilterOptionChange: (option: ExtendedDateFilters.DateFilterOption) => void;
}

export const RelativePresetFilterItems = ({
    filterOption,
    selectedFilterOption,
    onSelectedFilterOptionChange,
    className,
}: IRelativePresetFilterItemsProps) => {
    const relativePresets = granularityOrder
        .filter(granularity =>
            Boolean(filterOption && filterOption[granularity] && filterOption[granularity].length > 0),
        )
        .map(granularity => ({
            granularity,
            items: filterOption[granularity] as ExtendedDateFilters.IRelativeDateFilterPreset[],
        }));

    return (
        <>
            {relativePresets.map(preset => (
                <React.Fragment key={preset.granularity}>
                    <ListHeading className={className}>
                        <RelativePresetTitleTranslated granularity={preset.granularity} />
                    </ListHeading>
                    {preset.items.map(item => (
                        <ListItem
                            key={item.localIdentifier}
                            isSelected={item.localIdentifier === selectedFilterOption.localIdentifier}
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => onSelectedFilterOptionChange(item)}
                            className={cx(`s-relative-preset-${kebabCase(item.localIdentifier)}`, className)}
                        >
                            <DateFilterTextLocalized
                                filter={item}
                                // always consider excludeCurrentPeriod false here to make sure
                                // the preset names do not change with excludeCurrentPeriod (RAIL-1648)
                                excludeCurrentPeriod={false}
                            />
                        </ListItem>
                    ))}
                </React.Fragment>
            ))}
        </>
    );
};

// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import cx from "classnames";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate, parseDate } from "react-day-picker/moment";
import { DayPickerInputProps } from "react-day-picker/types/props";
import { InputClassNames } from "react-day-picker/types/common";
import { DateRangePickerInputFieldBody } from "./DateRangePickerInputFieldBody";

const getInputClassNames = (className?: string, classNameCalendar?: string): InputClassNames => ({
    container: cx("gd-date-range-picker-input", className),
    overlay: cx("gd-date-range-picker-picker", classNameCalendar),
    overlayWrapper: undefined,
});

interface IDateRangePickerInputFieldProps extends DayPickerInputProps {
    className?: string;
    classNameCalendar?: string;
}

export const DateRangePickerInputField = React.forwardRef<DayPickerInput, IDateRangePickerInputFieldProps>(
    (props: IDateRangePickerInputFieldProps, ref: any) => (
        <DayPickerInput
            {...props}
            ref={ref}
            formatDate={formatDate}
            parseDate={parseDate}
            classNames={getInputClassNames(props.className, props.classNameCalendar)}
            component={DateRangePickerInputFieldBody}
            hideOnDayClick={false}
        />
    ),
);

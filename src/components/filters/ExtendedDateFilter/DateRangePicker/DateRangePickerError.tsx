// (C) 2019 GoodData Corporation
import * as React from "react";
import { injectIntl, FormattedMessage, InjectedIntlProps } from "react-intl";

import { getLocalizedDateFormat } from "../utils/dateFormattingUtils";

interface IDateRangePickerErrorProps {
    errorId: string;
}

type DateRangePickerErrorComponentProps = IDateRangePickerErrorProps & InjectedIntlProps;

const DateRangePickerErrorComponent = (props: DateRangePickerErrorComponentProps) => {
    const { errorId, intl } = props;

    return (
        <div className="gd-date-range-picker-error-message s-absolute-range-error">
            <FormattedMessage id={errorId} values={{ format: getLocalizedDateFormat(intl.locale) }} />
        </div>
    );
};

export const DateRangePickerError = injectIntl(DateRangePickerErrorComponent);

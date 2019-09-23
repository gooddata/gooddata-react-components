// (C) 2019 GoodData Corporation
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import Button from "@gooddata/goodstrap/lib/Button/Button";

interface IExtendedDateFilterBodyButtonProps {
    onClick: () => void;
    messageId: string;
    className: string;
    disabled?: boolean;
}

const ExtendedDateFilterBodyButtonComponent: React.FC<
    IExtendedDateFilterBodyButtonProps & InjectedIntlProps
> = props => (
    <Button
        type="button"
        value={props.intl.formatMessage({ id: props.messageId })}
        className={props.className}
        disabled={props.disabled}
        onClick={props.onClick}
    />
);

export const ExtendedDateFilterBodyButton = injectIntl(ExtendedDateFilterBodyButtonComponent);

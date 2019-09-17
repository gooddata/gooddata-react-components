// (C) 2019 GoodData Corporation
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import Button from "@gooddata/goodstrap/lib/Button/Button";

interface IExtendedDateFilterBodyButtonOwnProps {
    onClick: () => void;
    messageId: string;
    className: string;
    disabled?: boolean;
}

type ExtendedDateFilterBodyButtonProps = IExtendedDateFilterBodyButtonOwnProps & InjectedIntlProps;

const ExtendedDateFilterBodyButtonComponent = (props: ExtendedDateFilterBodyButtonProps) => (
    <Button
        type="button"
        value={props.intl.formatMessage({ id: props.messageId })}
        className={props.className}
        disabled={props.disabled}
        onClick={props.onClick}
    />
);

export const ExtendedDateFilterBodyButton = injectIntl(ExtendedDateFilterBodyButtonComponent);

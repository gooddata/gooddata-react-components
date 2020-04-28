// (C) 2020 GoodData Corporation
import { useIntl } from "react-intl";
import { getNumericSymbols } from "../TranslationsProvider";

export function useNumericSymbols(): string[] {
    const intl = useIntl();
    return getNumericSymbols(intl);
}

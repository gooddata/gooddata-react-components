// (C) 2020 GoodData Corporation
import { AFM, VisualizationInput } from "@gooddata/typings";
import { ISeparators } from "./separators";

export interface IMeasureValueFilterCommonProps {
    filter: VisualizationInput.IMeasureValueFilter;
    onApply: (filter: AFM.IMeasureValueFilter) => void;
    usePercentage?: boolean;
    warningMessage?: string;
    locale?: string;
    separators?: ISeparators;
    displayTreatNullAsZeroOption?: boolean;
    treatNullAsZeroDefaultValue?: boolean;
}

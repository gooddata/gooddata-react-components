// (C) 2020 GoodData Corporation
import * as React from "react";
import * as numberJS from "@gooddata/numberjs";

import { FormattedPreview } from "./FormattedPreview";

interface IPreviewNumberRowProps {
    previewNumber: number;
    format: string;
    separators?: numberJS.ISeparators;
}

const PreviewNumberRow: React.FC<IPreviewNumberRowProps> = ({ previewNumber, format, separators }) => (
    <div className="gd-measure-format-extended-preview-row">
        <div className="gd-measure-format-extended-preview-number">
            <span>{previewNumber}</span>
        </div>
        <div className="s-number-format-preview-formatted gd-measure-format-extended-preview-formatted">
            <FormattedPreview previewNumber={previewNumber} format={format} separators={separators} />
        </div>
    </div>
);

export interface IPreviewNumberRowsProps {
    previewNumbers?: number[];
    format: string;
    separators?: numberJS.ISeparators;
}

const PreviewRows: React.FC<IPreviewNumberRowsProps> = ({ previewNumbers, format, separators }) => (
    <>
        {previewNumbers.map(previewNumber => (
            <PreviewNumberRow
                previewNumber={previewNumber}
                separators={separators}
                key={previewNumber}
                format={format}
            />
        ))}
    </>
);

PreviewRows.defaultProps = {
    previewNumbers: [0, 1.234, 1234.567, 1234567.891],
};

export default PreviewRows;

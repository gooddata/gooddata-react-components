// (C) 2007-2020 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from "react";
import get from "lodash/get";
import ExportDialog from "@gooddata/goodstrap/lib/Dialog/ExportDialog";
import PropTypes from "prop-types";

const DOWNLOADER_ID = "downloader";

export class ExampleWithExport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showExportDialog: false,
            errorMessage: null,
            exportResult: undefined,
        };

        this.doExport = this.doExport.bind(this);
    }

    /**
     * This will be called by child visualization once it successfully renders
     * and its underlying data is ready for export. The child visualization will
     * call this with one parameter: function that can be called to trigger the exports.
     */
    onExportReady = exportResult => {
        this.setState({ exportResult });
    };

    getExportDialog = () => {
        return (
            <ExportDialog
                headline="Export to XLSX"
                cancelButtonText="Cancel"
                submitButtonText="Export"
                isPositive
                seleniumClass="s-dialog"
                mergeHeaders
                mergeHeadersDisabled={false}
                mergeHeadersText="Keep attribute cells merged"
                mergeHeadersTitle="CELLS"
                onCancel={this.exportDialogCancel}
                onSubmit={this.exportDialogSubmit}
            />
        );
    };

    downloadFile = uri => {
        let anchor = document.getElementById(DOWNLOADER_ID);
        if (!anchor) {
            anchor = document.createElement("a");
            anchor.id = DOWNLOADER_ID;
            document.body.appendChild(anchor);
        }
        anchor.href = uri;
        anchor.download = uri;
        anchor.click();
    };

    exportDialogCancel = () => {
        this.setState({ showExportDialog: false });
    };

    exportToCSV = () => {
        this.doExport({});
    };

    exportToXLSX = () => {
        this.doExport({ format: "xlsx" });
    };

    exportWithCustomName = () => {
        this.doExport({ title: "CustomName" });
    };

    exportWithDialog = () => {
        this.setState({ showExportDialog: true });
    };

    exportDialogSubmit = data => {
        const { mergeHeaders, includeFilterContext } = data;

        this.setState({ showExportDialog: false });

        const exportConfig = { format: "xlsx", title: "CustomName", includeFilterContext, mergeHeaders };

        this.doExport(exportConfig);
    };

    async doExport(exportConfig) {
        try {
            const result = await this.state.exportResult(exportConfig);
            this.setState({ errorMessage: null });
            this.downloadFile(result.uri);
        } catch (error) {
            let errorMessage = error.message;
            if (error.responseBody) {
                errorMessage = get(JSON.parse(error.responseBody), "error.message");
            }
            this.setState({ errorMessage });
        }
    }

    render() {
        const { errorMessage, showExportDialog } = this.state;

        let errorComponent;
        if (errorMessage) {
            errorComponent = <div style={{ color: "red", marginTop: 5 }}>{errorMessage}</div>;
        }

        let exportDialog;
        if (showExportDialog) {
            exportDialog = this.getExportDialog();
        }

        return (
            <div style={{ height: 367 }}>
                {this.props.children(this.onExportReady)}
                <div style={{ marginTop: 15 }}>
                    <button
                        className="gd-button gd-button-secondary"
                        onClick={this.exportToCSV}
                        disabled={!this.state.exportResult}
                    >
                        Export CSV
                    </button>
                    <button
                        className="gd-button gd-button-secondary"
                        onClick={this.exportToXLSX}
                        disabled={!this.state.exportResult}
                    >
                        Export XLSX
                    </button>
                    <button
                        className="gd-button gd-button-secondary"
                        onClick={this.exportWithCustomName}
                        disabled={!this.state.exportResult}
                    >
                        Export with custom name CustomName
                    </button>
                    <button
                        className="gd-button gd-button-secondary"
                        onClick={this.exportWithDialog}
                        disabled={!this.state.exportResult}
                    >
                        Export using Export Dialog
                    </button>
                </div>
                {errorComponent}
                {exportDialog}
            </div>
        );
    }
}

ExampleWithExport.propTypes = {
    children: PropTypes.func.isRequired,
};

export default ExampleWithExport;

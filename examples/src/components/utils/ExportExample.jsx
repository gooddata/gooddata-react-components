// (C) 2007-2018 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { okaidia } from 'react-syntax-highlighter/styles/prism';
import ExportDialog from '@gooddata/goodstrap/lib/Dialog/ExportDialog';

export class ExportExample extends React.Component {
    static propTypes = {
        source: PropTypes.string.isRequired,
        for: PropTypes.func.isRequired,
        showExportDialog: PropTypes.bool
    };

    static defaultProps = {
        showExportDialog: false
    };

    constructor() {
        super();
        this.state = {
            hidden: true,
            doExport: false,
            showExportDialog: false,
            errorMessage: null
        };
        this.toggle = this.toggle.bind(this);
        this.buttonExportClick = this.buttonExportClick.bind(this);
        this.getExportConfig = this.getExportConfig.bind(this);
        this.getExportDialog = this.getExportDialog.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        if (this.state.doExport) {
            this.setState({ doExport: false });
        }
        return true;
    }

    getExportConfig() {
        return {
            format: 'xlsx',
            onExportFinished: (result) => {
                if (result.uri) {
                    this.setState({
                        errorMessage: null,
                        doExport: false
                    });

                    // download file
                    this.downloadFile(result.uri);
                } else {
                    let errorMessage = result.message;
                    if (result.responseBody) {
                        errorMessage = JSON.parse(result.responseBody).error.message;
                    }
                    this.setState({
                        errorMessage,
                        doExport: false
                    });
                }
            }
        };
    }

    getExportDialog() {
        return (
            <ExportDialog
                headline="Export to XLSX"
                cancelButtonText="Cancel"
                submitButtonText="Export"
                isPositive
                seleniumClass="s-dialog"

                includeFilterContext
                includeFilterContextText="Include applied filters"
                includeFilterContextTitle="INSIGHT CONTEXT"

                mergeHeaders
                mergeHeadersDisabled={false}
                mergeHeadersText="Keep attribute cells merged"
                mergeHeadersTitle="CELLS"

                onCancel={() => {
                    this.setState({
                        showExportDialog: false
                    });
                }}
                onSubmit={() => {
                    this.setState({
                        showExportDialog: false,
                        doExport: true
                    });
                }}
            />
        );
    }

    buttonExportClick() {
        if (this.props.showExportDialog) {
            this.setState({ showExportDialog: true });
        } else {
            this.setState({ doExport: true });
        }
    }

    downloadFile(uri) {
        const anchor = document.createElement('a');
        anchor.href = uri;
        anchor.download = uri;
        document.body.appendChild(anchor);
        anchor.click();
    }

    toggle() {
        this.setState({ hidden: !this.state.hidden });
    }

    render() {
        const { hidden } = this.state;
        const Component = this.props.for;

        const iconClassName = hidden ? 'icon-navigatedown' : 'icon-navigateup';

        let exportConfig;
        if (this.state.doExport) {
            exportConfig = this.getExportConfig();
        }

        let exportDialog;
        if (this.state.showExportDialog) {
            exportDialog = this.getExportDialog();
        }

        return (
            <div className="example-with-source">
                <style jsx>{`
                    .example-with-source {
                        flex: 1 0 auto;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: stretch;
                        margin-top: 30px;
                    }

                    .example {
                        padding: 20px;
                        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
                        background-color: white;
                    }

                    .source {
                        margin: 20px 0;
                    }

                    :global(pre) {
                        overflow: auto;
                    }

                    .export-error {
                        color: red;
                        padding: 5px 0;
                    }
                `}</style>
                <div className="example"><Component exportConfig={exportConfig} /></div>
                <div className="source">
                    <button
                        className="button button-secondary"
                        onClick={this.buttonExportClick}
                    >Export
                    </button>
                    <button className={`button button-secondary button-dropdown icon-right ${iconClassName}`} onClick={this.toggle}>source code</button>
                    {hidden ? '' : (
                        <SyntaxHighlighter language="jsx" style={okaidia}>{this.props.source}</SyntaxHighlighter>
                    )}
                    {this.state.errorMessage ? <div className="export-error">{this.state.errorMessage}</div> : null}
                </div>
                {exportDialog}
            </div>
        );
    }
}

export default ExportExample;

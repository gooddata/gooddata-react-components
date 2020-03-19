// (C) 2020 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from "react";
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

export class SourceDropdown extends React.Component {
    static propTypes = {
        source: PropTypes.string.isRequired,
    };

    constructor() {
        super();
        this.state = { hidden: true };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ hidden: !this.state.hidden });
    }

    render() {
        const { hidden } = this.state;

        const iconClassName = hidden ? "icon-navigatedown" : "icon-navigateup";

        return (
            <div className="example-with-source">
                <style jsx>{`
                    .source {
                        margin: 20px 0;
                    }

                    :global(pre) {
                        overflow: auto;
                    }
                `}</style>
                <div className="source">
                    <button
                        className={`gd-button gd-button-secondary button-dropdown icon-right ${iconClassName}`}
                        onClick={this.toggle}
                    >
                        source code
                    </button>
                    {hidden ? (
                        ""
                    ) : (
                        <SyntaxHighlighter language="jsx" style={okaidia}>
                            {this.props.source}
                        </SyntaxHighlighter>
                    )}
                </div>
            </div>
        );
    }
}

export default SourceDropdown;

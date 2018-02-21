import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { okaidia } from 'react-syntax-highlighter/styles/prism';

export class ExampleWithSource extends React.Component {
    static propTypes = {
        source: PropTypes.string.isRequired,
        for: PropTypes.func.isRequired
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
        const Component = this.props.for;

        const iconClassName = hidden ? 'icon-navigatedown' : 'icon-navigateup';

        return (
            <div className="example-with-source">
                <style jsx>{`
                    .source {
                        margin: 20px 0;
                    }
                `}</style>
                <Component />
                <div className="source">
                    <button className={`button button-secondary button-dropdown icon-right ${iconClassName}`} onClick={this.toggle}>source</button>
                </div>
                {hidden ? '' : (
                    <SyntaxHighlighter language="jsx" style={okaidia}>{this.props.source}</SyntaxHighlighter>
                )}
            </div>
        );
    }
}

export default ExampleWithSource;

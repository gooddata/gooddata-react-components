import * as React from 'react';
import { connect } from 'react-redux';

interface IProps {
    filters: String[];
}

class FilterContext extends React.Component<IProps,null> {
    static propTypes = {
        filters: React.PropTypes.arrayOf(React.PropTypes.string),
        children: React.PropTypes.node
    };

    render() {
        const { filters } = this.props;
        const children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child as JSX.Element, { filters });
        });

        return (
            <div>{children}</div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        filters: ownProps.filterIds.reduce((filters, filterId) => {
            return {
                ...filters,
                [filterId]: state.getIn(['filters', filterId])
            };
        }, {})
    };
};

const mapDispatchToProps = () => {
    // TODO FIXME
};

const connectedFilterContext = connect(mapStateToProps, mapDispatchToProps)(FilterContext);
export { connectedFilterContext as FilterContext };

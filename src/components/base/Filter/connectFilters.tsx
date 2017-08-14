import * as React from 'react';
import { connect } from 'react-redux';
import { changeFilter } from './actionCreators';

export function connectFilters(Component, filterIds) {
    const mapStateToProps = (state) => {
        return {
            filters: filterIds.reduce((filters, filterId) => {
                return {
                    ...filters,
                    [filterId]: state.filters[filterId]
                };
            }, {})
        };
    };

    const mapDispatchToProps = dispatch => ({
        changeFilter: (filterId, changes) => dispatch(changeFilter(filterId, changes))
    });

    const WrappedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

    return class ConnectedFilters extends React.PureComponent<null,null> {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}

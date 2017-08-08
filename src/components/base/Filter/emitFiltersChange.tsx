import * as React from 'react';

export function emitFiltersChange(WrappedComponent, filter) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.changeFilter = this.changeFilter.bind(this);
        }

        changeFilter() {
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}

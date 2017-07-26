import * as PropTypes from 'prop-types';

export default {
    transformation: PropTypes.shape({
        sorting: PropTypes.arrayOf(
            PropTypes.shape({
                column: PropTypes.string.isRequired,
                direction: PropTypes.string.isRequired
            })
        ),
        measures: PropTypes.arrayOf(
            PropTypes.shape({ column: PropTypes.string, })
        ),
        buckets: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                attributes: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.string.isRequired,
                        title: PropTypes.string
                    })
                ).isRequired
            })
        )
    })
};

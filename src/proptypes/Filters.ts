import * as PropTypes from 'prop-types';
import { isString, isNumber } from 'lodash';

// TODO: Validate decimal numbers
// TODO: Validate date format
function twoNumbersOrTwoStrings(props, propName, componentName) {
    const between = props.between;

    if (!Array.isArray(between) ||
        between.length !== 2 ||
        !(
            between.every(isString) ||
            between.every(isNumber)
        )
    ) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Validation failed.
            Prop ${propName} must be array of two numbers or array of two strings.`
        );
    }
}

export default {
    filters: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                type: PropTypes.oneOf(['date']).isRequired,
                between: twoNumbersOrTwoStrings,
                granularity: PropTypes.string.isRequired
            }),
            PropTypes.oneOfType([
                PropTypes.shape({ in: PropTypes.arrayOf(PropTypes.string).isRequired }),
                PropTypes.shape({ notIn: PropTypes.arrayOf(PropTypes.string).isRequired })
            ]).isRequired
        ])
    )
};

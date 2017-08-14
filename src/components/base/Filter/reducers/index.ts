import { CHANGE_FILTER, REMOVE_FILTER } from '../actionCreators';

function filtersReducer(state = {}, action) {
    switch (action.type) {
        case REMOVE_FILTER: {
            const { filterId } = action.payload;
            delete state[filterId];
            return {
                ...state
            };
        }

        case CHANGE_FILTER: {
            const { filterId, changes } = action.payload;
            return {
                ...state,
                [filterId]: changes
            };
        }

        default:
            return state;
    }
}

export {
    filtersReducer
};

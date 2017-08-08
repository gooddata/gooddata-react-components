import { fromJS } from 'immutable';
import { CHANGE_FILTER, REMOVE_FILTER } from '../actionCreators';

const defaultState = fromJS({
    filters: {}
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case REMOVE_FILTER: {
            const { filterId } = action.payload;
            return state.delete(filterId);
        }

        case CHANGE_FILTER: {
            const { filterId, changes } = action.payload;
            return state.setIn(['filters', filterId], changes);
        }

        default:
            return state;
    }
};

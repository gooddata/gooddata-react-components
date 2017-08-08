export const CHANGE_FILTER = 'CHANGE_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';

export function addFilter(filterId, changes) {
    return changeFilter(filterId, changes);
}

export function remoteFilter(filterId) {
    return {
        type: REMOVE_FILTER,
        payload: {
            filterId
        }
    };
}

export function changeFilter(filterId, changes) {
    return {
        type: CHANGE_FILTER,
        payload: {
            filterId,
            changes
        }
    };
}

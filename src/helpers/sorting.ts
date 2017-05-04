import { ISort } from '../interfaces/Transformation';
import { ASC, DESC, COLUMN_TYPE_METRIC } from '../react/constants/Sorting';

export interface ISortingChange {
    id: string;
    title: string;
    type: string;
    uri: string;
}

function getColumn(change: ISortingChange): string {
    return change.type === COLUMN_TYPE_METRIC ? change.id : change.uri;
}

function toggleSorting(currentSorting) {
    return currentSorting === ASC ? DESC : ASC;
}

function getDirection(change: ISortingChange, prevSorting: ISort) {
    const defaultSortingDirection = change.type === COLUMN_TYPE_METRIC ? DESC : ASC;

    if (!prevSorting || prevSorting.column !== getColumn(change)) {
        return defaultSortingDirection;
    }

    return toggleSorting(prevSorting.direction);
}

export function getSorting(change, prevSorting: ISort): ISort {
    return {
        column: getColumn(change),
        direction: getDirection(change, prevSorting)
    };
}

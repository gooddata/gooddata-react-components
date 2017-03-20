export interface IDataSource {
    getData(transformation): Promise<any>;
}

export interface IAdapter {
    createDataSource(afm): IDataSource;
}

// export interface IDataTable {
//     sortBy();
//     filterBy();
//     hideColumn();
//     getTotals();
//     transpose();
//     crosstab();
// }

// export interface IRange {
//     start: Number;
//     end: Number;
// }

// export interface IDataResult {
//     getRows(range?: IRange);
//     getColumns(range?: IRange);
//     getCells(rowsRange: IRange, columnsRange: IRange);
//     getAll();
//     getCount(): Number;
//     getTotalCount(): Number;
// }

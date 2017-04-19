import * as React from 'react';
import { isEqual } from 'lodash';

import { IAfm } from '../../interfaces/Afm';
import { ITransformation } from '../../interfaces/Transformation';
import { IDataTable } from '../../interfaces/DataTable';
import { DataTable } from '../../DataTable';
import { SimpleExecutorAdapter } from '../../adapters/SimpleExecutorAdapter';

export interface IExecuteProps {
    afm: IAfm;
    transformation?: ITransformation;
    projectId: string;
    // TODO: Use proper interface
    onExecute: (result: Object) => void;
    onError: (error: Object) => void;
    onLoading: (state: boolean) => void;
    dataTableFactory?: IDataTableFactory;
    className?: string;
}

export type IDataTableFactory = (projectId: string) => IDataTable;

function execute(dataTable: IDataTable, afm: IAfm, transformation: ITransformation = {}): Promise<Object> {
    return dataTable.execute(afm, transformation);
}

function dataTableFactory(projectId): IDataTable {
    const adapter = new SimpleExecutorAdapter(projectId);
    return new DataTable(adapter);
}

export class Execute extends React.Component<IExecuteProps, undefined> {

    public static defaultProps: Partial<IExecuteProps> = {
        dataTableFactory
    };

    private dataTable: IDataTable;

    public constructor(props) {
        super(props);

        this.dataTable = props.dataTableFactory(props.projectId);
    }

    public componentDidMount() {
        this.runExecution(this.props);
    }

    public componentWillReceiveProps(nextProps) {
        if (this.hasPropsChanged(nextProps, ['afm'])) {
            this.runExecution(nextProps);
        }
    }

    public shouldComponentUpdate(nextProps) {
        return this.hasPropsChanged(nextProps, ['afm', 'children']);
    }

    public render() {
        return (
            <span className={this.props.className}>{this.props.children}</span>
        );
    }

    private isPropChanged(nextProps, propName) {
        if (propName === 'children') {
            return nextProps.children !== this.props.children;
        }

        return !isEqual(nextProps[propName], this.props[propName]);
    }

    private hasPropsChanged(nextProps, propNames) {
        return propNames.some((propName) => this.isPropChanged(nextProps, propName));
    }

    private runExecution(props) {
        const { afm, transformation, onExecute, onError, onLoading } = props;

        this.props.onLoading(true);

        execute(this.dataTable, afm, transformation)
            .then(onExecute)
            .catch(onError)
            .then(() => onLoading(false));
    };
}

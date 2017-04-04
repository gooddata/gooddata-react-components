import * as React from 'react';
import { isEqual } from 'lodash';

import { IAfm } from '../../interfaces/Afm';
import { IDataTable } from '../../interfaces/DataTable';
import { DataTable } from '../../DataTable';
import { SimpleExecutorAdapter } from '../../adapters/SimpleExecutorAdapter';

export interface IExecuteProps {
    afm: IAfm;
    projectId: string;
    // TODO: Use proper interface
    onExecute: (result: Object) => void;
    onError: (error: Object) => void;
    onLoading: (state: boolean) => void;
    dataTableFactory?: IDataTableFactory;
    className?: string;
}

type IDataTableFactory = (projectId: string) => IDataTable;

function execute(dataTable: IDataTable, afm: IAfm): Promise<Object> {
    // TODO: Do we need to pass custom transformation?
    return dataTable.execute(afm, null);
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
        this.runExecution();
    }

    public componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.afm, this.props.afm)) {
            this.runExecution();
        }
    }

    public shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps.afm, this.props.afm) ||
            !isEqual(nextProps.children, this.props.children);
    }

    public render() {
        return (
            <span className={this.props.className}>{this.props.children}</span>
        );
    }

    private runExecution() {
        const { afm } = this.props;

        this.props.onLoading(true);

        execute(this.dataTable, afm)
            .then(this.props.onExecute)
            .catch(this.props.onError)
            .then(() => this.props.onLoading(false));
    };
}

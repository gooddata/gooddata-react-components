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
}

function execute(dataTable: IDataTable, afm: IAfm): Promise<Object> {
    // TODO: Do we need to pass custom transformation?
    return dataTable.execute(afm, null);
}

export class Execute extends React.Component<IExecuteProps, undefined> {

    private dataTable: IDataTable;

    public constructor(props) {
        super(props);

        const adapter = new SimpleExecutorAdapter(props.projectId);
        this.dataTable = new DataTable(adapter);
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
        return !isEqual(nextProps.afm, this.props.afm);
    }

    public render() {
        return (
            <div>{this.props.children}</div>
        );
    }

    private runExecution() {
        const { afm } = this.props;

        execute(this.dataTable, afm)
            .then(this.props.onExecute)
            .catch(this.props.onError);
    };
}

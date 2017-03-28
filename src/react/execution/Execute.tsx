import * as React from 'react';
import { IAfm } from "../../Afm";
import { DataTable } from "../../DataTable";
import { SimpleExecutorAdapter } from "../../adapters/SimpleExecutorAdapter";

export interface IExecuteProps {
    afm: IAfm;
    projectId: string;
    // TODO: Use proper interface
    onExecute: (result: object) => void;
    onError: (error: object) => void;
}

// TODO: Is it ok to create data table every time?
function execute(projectId: string, afm: IAfm): Promise<object> {
    const adapter = new SimpleExecutorAdapter(projectId);
    const dataTable = new DataTable(adapter);

    // TODO: Do we need to pass custom transformation?
    return dataTable.execute(afm, null);
}

export class Execute extends React.Component<IExecuteProps, undefined> {
    public componentDidMount() {
        this.runExecution();
    }

    public componentWillReceiveProps() {
        this.runExecution();
    }

    public render() {
        return (
            <div>{this.props.children}</div>
        );
    }

    private runExecution() {
        const { projectId, afm } = this.props;

        execute(projectId, afm)
            .then(this.props.onExecute)
            .catch(this.props.onError);
    };
}

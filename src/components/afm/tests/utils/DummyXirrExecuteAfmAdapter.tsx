// (C) 2007-2019 GoodData Corporation
import { SDK, DataLayer } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";
import { executionResponses } from "./dummyXirrFixture";

export class DummyXirrExecuteAfmAdapter extends DataLayer.ExecuteAfmAdapter {
    public createDataSource(
        afm: AFM.IAfm,
        fingerprint?: string,
    ): Promise<DataLayer.DataSource.IDataSource<Execution.IExecutionResponses>> {
        const execFactory = () => {
            return Promise.resolve(executionResponses);
        };
        const dataSource = new DataLayer.DataSource.DataSource<Execution.IExecutionResponses>(
            execFactory,
            afm,
            fingerprint,
        );
        return Promise.resolve(dataSource);
    }
}

export function dummyXirrExecuteAfmAdapterFactory(sdk: SDK, projectId: string) {
    return new DummyXirrExecuteAfmAdapter(sdk, projectId);
}

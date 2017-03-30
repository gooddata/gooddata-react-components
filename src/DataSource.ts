import { IDataSource } from './Interfaces';

type execFactory = (transformation) => Promise<any>;

export class DataSource implements IDataSource {

    private execFactory: execFactory;

    constructor(execFactory: execFactory) {
        this.execFactory = execFactory;
    }

    public getData(transformation): Promise<any> {
        return this.execFactory(transformation);
    }
}

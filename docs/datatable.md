# DataTable

## Usage with events
```
import { DataTable, SimpleExecutorAdapter } from '@gooddata/data-layer';
import * as gooddata from 'gooddata';

const afm = {
    measures: [
        {
            id: 'measure'
            definition: {
                baseObject: {
                    id: '/gdc/md/uri/'
                }
            }
        }
    ]
};

const transformation = {};

gooddata.config.setCustomDomain('secure.gooddata.com');
gooddata.user.login('username', 'password').then(() => {
    const adapter = new SimpleExecutorAdapter('projectId');
    const dt = new DataTable(adapter);

    dt.onData((data) => console.log(data));
    dt.onError((err) => console.error(err));

    dt.getData(afm, transformation);
});
```

## Usage with promise
```
import { DataTable, SimpleExecutorAdapter } from '@gooddata/data-layer';
import * as gooddata from 'gooddata';

const afm = {
    measures: [
        {
            id: 'measure'
            definition: {
                baseObject: {
                    id: '/gdc/md/uri/'
                }
            }
        }
    ]
};

const transformation = {};

gooddata.config.setCustomDomain('secure.gooddata.com');
gooddata.user.login('username', 'password').then(() => {
    const adapter = new SimpleExecutorAdapter('projectId');
    const dt = new DataTable(adapter);

    dt.execute(afm, transformation).then((data) => {
        console.log(data);
    }).catch((err) => {
        console.error(data);
    })
});
```
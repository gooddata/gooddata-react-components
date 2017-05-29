import * as invariant from 'invariant';

const REG_URI_OBJ = /\/gdc\/md\/(\S+)\/obj\/\d+/;

export function getProjectId(uri: string): string {
    invariant(REG_URI_OBJ.test(uri), 'Uri does not contain project id.');

    const [, projectId] = REG_URI_OBJ.exec(uri);

    return projectId;
}

import * as invariant from 'invariant';

const REG_URI_OBJ = /\/gdc\/md\/(\S+)\/obj\/\d+/;

export const isUri = (identifier: string) => REG_URI_OBJ.test(identifier);
export const areUris = (identifiers: string[]) => identifiers.every(isUri);

export function getProjectId(uri: string): string {
    invariant(isUri(uri), 'Uri does not contain project id.');

    const [, projectId] = REG_URI_OBJ.exec(uri);

    return projectId;
}

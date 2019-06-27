// (C) 2019 GoodData Corporation
import { AFM } from "@gooddata/typings";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import uniqBy from "lodash/unionBy";
import flatMap from "lodash/flatMap";

export function expandTotalsInAfm(afm: AFM.IAfm): AFM.IAfm {
    if (isEmpty(afm.measures) || isEmpty(afm.nativeTotals)) {
        return afm;
    }
    const optimizedAfm = cloneDeep(afm);

    optimizedAfm.nativeTotals = afm.measures.map(
        (measure): AFM.INativeTotalItem => {
            return {
                measureIdentifier: measure.localIdentifier,
                attributeIdentifiers: [],
            };
        },
    );

    return optimizedAfm;
}

export function expandTotalsInResultSpec(afm: AFM.IAfm, resultSpec: AFM.IResultSpec): AFM.IResultSpec {
    const totals: AFM.ITotalItem[] = get(resultSpec, ["dimensions", "0", "totals"], []);
    if (isEmpty(afm.measures) || isEmpty(afm.attributes) || isEmpty(totals)) {
        return resultSpec;
    }

    const uniqueTotalsByType = uniqBy(totals, "type");
    const optimizedTotals = flatMap(uniqueTotalsByType, total => {
        return afm.measures.map(
            (measure): AFM.ITotalItem => {
                return {
                    measureIdentifier: measure.localIdentifier,
                    type: total.type,
                    attributeIdentifier: afm.attributes[0].localIdentifier,
                };
            },
        );
    });

    const optimizedResultSpec = cloneDeep(resultSpec);
    optimizedResultSpec.dimensions[0].totals = optimizedTotals;

    return optimizedResultSpec;
}
